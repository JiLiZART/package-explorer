"use client"

import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { Search, Home } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarRail,
} from "@/components/ui/sidebar"
import { PackageTree } from "@/components/package-tree"
import type { PackageData } from "@/types/package-types"

interface PackageSidebarProps {
  packageData: PackageData
  selectedPackage: string | null
}

export function PackageSidebar({ packageData, selectedPackage }: PackageSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const navigate = useNavigate()

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]))
  }

  const handleSelectPackage = (packagePath: string) => {
    navigate({ to: "/package/$packagePath", params: { packagePath: encodeURIComponent(packagePath) } })
  }

  const stats = {
    total: Object.keys(packageData.packages || {}).length,
    direct: Object.keys(packageData.dependencies || {}).length,
    dev: Object.keys(packageData.devDependencies || {}).length,
    optional: Object.keys(packageData.optionalDependencies || {}).length,
    peer: Object.keys(packageData.peerDependencies || {}).length,
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="p-2">
          <div className="relative flex gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => navigate({ to: "/" })}>
              <Home className="h-4 w-4" />
            </Button>
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search packages by name or version..."
                className="pl-8 h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dependencies</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="grid grid-cols-2 gap-2 px-2 mb-2">
              <div className="flex flex-col text-xs">
                <span className="font-medium">{stats.total}</span>
                <span className="text-muted-foreground">total</span>
              </div>
              <div className="flex flex-col text-xs">
                <span className="font-medium">{stats.direct}</span>
                <span className="text-muted-foreground">direct</span>
              </div>
            </div>
            <div className="flex gap-2 px-2 mb-4">
              <button
                onClick={() => toggleFilter("regular")}
                className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                  activeFilters.includes("regular")
                    ? "bg-blue-500 text-white border-transparent"
                    : "bg-blue-500/10 text-blue-500 border-transparent hover:bg-blue-500/20"
                }`}
              >
                Regular
              </button>
              <button
                onClick={() => toggleFilter("dev")}
                className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                  activeFilters.includes("dev")
                    ? "bg-purple-500 text-white border-transparent"
                    : "bg-purple-500/10 text-purple-500 border-transparent hover:bg-purple-500/20"
                }`}
              >
                Dev
              </button>
              <button
                onClick={() => toggleFilter("optional")}
                className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                  activeFilters.includes("optional")
                    ? "bg-yellow-500 text-white border-transparent"
                    : "bg-yellow-500/10 text-yellow-500 border-transparent hover:bg-yellow-500/20"
                }`}
              >
                Optional
              </button>
              <button
                onClick={() => toggleFilter("peer")}
                className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                  activeFilters.includes("peer")
                    ? "bg-pink-500 text-white border-transparent"
                    : "bg-pink-500/10 text-pink-500 border-transparent hover:bg-pink-500/20"
                }`}
              >
                Peer
              </button>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Dependency Tree</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <PackageTree
                packageData={packageData}
                searchQuery={searchQuery}
                selectedPackage={selectedPackage}
                onSelectPackage={handleSelectPackage}
                activeFilters={activeFilters}
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

