"use client"

import { useState } from "react"
import { ChevronRight, Package, FileCode } from "lucide-react"
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import type { PackageData } from "@/types/package-types"

interface PackageTreeProps {
  packageData: PackageData
  searchQuery: string
  selectedPackage: string | null
  onSelectPackage: (packageName: string) => void
}

export function PackageTree({ packageData, searchQuery, selectedPackage, onSelectPackage }: PackageTreeProps) {
  const [expandedPackages, setExpandedPackages] = useState<Record<string, boolean>>({})

  // Get direct dependencies
  const directDependencies = {
    ...packageData.dependencies,
    ...packageData.devDependencies,
    ...packageData.optionalDependencies,
    ...packageData.peerDependencies,
  }

  // Filter packages based on search query
  const filteredPackages = Object.entries(directDependencies || {})
    .filter(([name]) => searchQuery === "" || name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort(([a], [b]) => a.localeCompare(b))

  const toggleExpand = (packageName: string) => {
    setExpandedPackages((prev) => ({
      ...prev,
      [packageName]: !prev[packageName],
    }))
  }

  const getPackageType = (name: string) => {
    if (packageData.dependencies && name in packageData.dependencies) return "regular"
    if (packageData.devDependencies && name in packageData.devDependencies) return "dev"
    if (packageData.optionalDependencies && name in packageData.optionalDependencies) return "optional"
    if (packageData.peerDependencies && name in packageData.peerDependencies) return "peer"
    return "regular"
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

  return (
    <div className="space-y-1">
      {filteredPackages.map(([name, version]) => {
        const type = getPackageType(name)
        const dependencyCount = getDependencyCount(name)
        const isExpanded = expandedPackages[name]
        const isSelected = selectedPackage === name

        return (
          <SidebarMenuItem key={name}>
            <Collapsible open={isExpanded} onOpenChange={() => toggleExpand(name)} className="w-full">
              <div className="flex items-center">
                <CollapsibleTrigger asChild>
                  <button className="h-4 w-4 flex items-center justify-center">
                    {dependencyCount > 0 && (
                      <ChevronRight className={`h-3 w-3 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                    )}
                  </button>
                </CollapsibleTrigger>
                <SidebarMenuButton isActive={isSelected} onClick={() => onSelectPackage(name)} className="flex-1">
                  <Package className={`h-4 w-4 ${getTypeColor(type)}`} />
                  <span>{name}</span>
                  <Badge variant="outline" className="ml-auto text-xs">
                    {dependencyCount}
                  </Badge>
                </SidebarMenuButton>
              </div>

              {dependencyCount > 0 && (
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {/* This would recursively render child dependencies */}
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton>
                        <FileCode className="h-4 w-4" />
                        <span>Child dependencies would go here</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              )}
            </Collapsible>
          </SidebarMenuItem>
        )
      })}
    </div>
  )
}

