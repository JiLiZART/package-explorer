"use client"

import { useState, useRef, useMemo, useCallback } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { ChevronRight, Package } from "lucide-react"
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import type { PackageData } from "@/types/package-types"

interface FlattenedPackage {
  id: string
  name: string
  version: string
  level: number
  hasChildren: boolean
  isExpanded: boolean
  type: string
  dependencyCount: number
  parentId?: string
}

interface PackageTreeProps {
  packageData: PackageData
  searchQuery: string
  selectedPackage: string | null
  onSelectPackage: (packageName: string) => void
  activeFilters: string[]
}

export function PackageTree({
  packageData,
  searchQuery,
  selectedPackage,
  onSelectPackage,
  activeFilters,
}: PackageTreeProps) {
  const [expandedPackages, setExpandedPackages] = useState<Record<string, boolean>>({})
  const parentRef = useRef<HTMLDivElement>(null)

  // Get direct dependencies
  const directDependencies = useMemo(() => {
    return {
      ...packageData.dependencies,
      ...packageData.devDependencies,
      ...packageData.optionalDependencies,
      ...packageData.peerDependencies,
    }
  }, [packageData])

  const getPackageType = useCallback(
    (name: string, parentType?: string) => {
      // If this is a child package, inherit the parent's type if it's a filtered type
      if (parentType && activeFilters.includes(parentType)) {
        return parentType
      }

      if (packageData.dependencies && name in packageData.dependencies) return "regular"
      if (packageData.devDependencies && name in packageData.devDependencies) return "dev"
      if (packageData.optionalDependencies && name in packageData.optionalDependencies) return "optional"
      if (packageData.peerDependencies && name in packageData.peerDependencies) return "peer"

      // For transitive dependencies, check if they're required by any package of the filtered type
      if (activeFilters.length > 0) {
        const pkg = packageData.packages?.[`node_modules/${name}`]
        if (pkg) {
          for (const filter of activeFilters) {
            const filterDeps =
              filter === "dev"
                ? packageData.devDependencies
                : filter === "optional"
                  ? packageData.optionalDependencies
                  : filter === "peer"
                    ? packageData.peerDependencies
                    : packageData.dependencies

            if (
              filterDeps &&
              Object.keys(filterDeps).some((dep) => {
                const depPkg = packageData.packages?.[`node_modules/${dep}`]
                return depPkg && depPkg.dependencies && name in depPkg.dependencies
              })
            ) {
              return filter
            }
          }
        }
      }

      return "regular"
    },
    [packageData, activeFilters],
  )

  const getDependencyCount = (packageName: string) => {
    const pkg = packageData.packages?.[`node_modules/${packageName}`]
    if (!pkg) return 0

    const dependencies = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
      ...pkg.peerDependencies,
      ...pkg.optionalDependencies,
    }

    return Object.keys(dependencies || {}).length
  }

  // Flatten the tree structure for virtualization
  const flattenPackages = useMemo(() => {
    const flattened: FlattenedPackage[] = []

    const flatten = (packages: Record<string, any>, level = 0, parentId?: string, parentType?: string) => {
      Object.entries(packages)
        .filter(([name]) => {
          const matchesSearch = searchQuery === "" || name.toLowerCase().includes(searchQuery.toLowerCase())

          const type = getPackageType(name, parentType)
          const matchesFilter = activeFilters.length === 0 || activeFilters.includes(type)

          return matchesSearch && matchesFilter
        })
        .sort(([a], [b]) => a.localeCompare(b))
        .forEach(([name, version]) => {
          const id = parentId ? `${parentId}-${name}` : name
          const pkg = packageData.packages?.[`node_modules/${name}`]
          const dependencies = pkg
            ? {
                ...pkg.dependencies,
                ...pkg.devDependencies,
                ...pkg.peerDependencies,
                ...pkg.optionalDependencies,
              }
            : {}
          const dependencyCount = Object.keys(dependencies || {}).length
          const type = getPackageType(name, parentType)

          flattened.push({
            id,
            name,
            version: typeof version === "string" ? version : version.version || "",
            level,
            hasChildren: dependencyCount > 0,
            isExpanded: !!expandedPackages[id],
            type,
            dependencyCount,
            parentId,
          })

          // If package is expanded and has dependencies, add them to the flattened list
          if (expandedPackages[id] && dependencies) {
            flatten(dependencies, level + 1, id, type)
          }
        })
    }

    flatten(directDependencies)
    return flattened
  }, [directDependencies, expandedPackages, searchQuery, packageData.packages, activeFilters, getPackageType])

  const rowVirtualizer = useVirtualizer({
    count: flattenPackages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 36,
    overscan: 5,
  })

  const toggleExpand = (packageId: string) => {
    setExpandedPackages((prev) => ({
      ...prev,
      [packageId]: !prev[packageId],
    }))
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "regular":
        return "text-blue-500"
      case "dev":
        return "text-purple-500"
      case "optional":
        return "text-yellow-500"
      case "peer":
        return "text-pink-500"
      default:
        return "text-blue-500"
    }
  }

  const getPackageIcon = (type: string) => {
    const baseClasses = "h-4 w-4"
    switch (type) {
      case "dev":
        return <Package className={`${baseClasses} text-purple-500`} />
      case "optional":
        return <Package className={`${baseClasses} text-yellow-500`} />
      case "peer":
        return <Package className={`${baseClasses} text-pink-500`} />
      default:
        return <Package className={`${baseClasses} text-blue-500`} />
    }
  }

  return (
    <div
      ref={parentRef}
      className="h-[calc(100vh-200px)] overflow-auto"
      style={{
        contain: "strict",
      }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const pkg = flattenPackages[virtualRow.index]
          return (
            <div
              key={pkg.id}
              data-index={virtualRow.index}
              ref={rowVirtualizer.measureElement}
              className={`absolute top-0 left-0 w-full`}
              style={{
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <SidebarMenuItem>
                <Collapsible open={pkg.isExpanded} onOpenChange={() => toggleExpand(pkg.id)}>
                  <div
                    className="flex items-center w-full"
                    style={{
                      paddingLeft: `${pkg.level * 16}px`,
                    }}
                  >
                    <div className="flex items-center flex-1">
                      {pkg.hasChildren ? (
                        <CollapsibleTrigger className="h-4 w-4 flex items-center justify-center">
                          <ChevronRight
                            className={`h-3 w-3 transition-transform ${pkg.isExpanded ? "rotate-90" : ""}`}
                          />
                        </CollapsibleTrigger>
                      ) : (
                        <div className="w-4" />
                      )}
                      <SidebarMenuButton
                        isActive={selectedPackage === pkg.name}
                        onClick={() => onSelectPackage(pkg.name)}
                        className="flex-1"
                      >
                        {getPackageIcon(pkg.type)}
                        <span>{pkg.name}</span>
                        {pkg.dependencyCount > 0 && (
                          <Badge variant="outline" className="ml-auto text-xs">
                            {pkg.dependencyCount}
                          </Badge>
                        )}
                      </SidebarMenuButton>
                    </div>
                  </div>
                </Collapsible>
              </SidebarMenuItem>
            </div>
          )
        })}
      </div>
    </div>
  )
}

