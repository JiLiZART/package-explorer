"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
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
import { Badge } from "@/components/ui/badge"
import { PackageTree } from "@/components/package-tree"
import type { PackageData } from "@/types/package-types"

interface PackageSidebarProps {
  packageData: PackageData
  selectedPackage: string | null
  onSelectPackage: (packageName: string) => void
}

export function PackageSidebar({ packageData, selectedPackage, onSelectPackage }: PackageSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")

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
          <div className="relative">
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
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">
                Regular
              </Badge>
              <Badge variant="outline" className="bg-purple-500/10 text-purple-500 hover:bg-purple-500/20">
                Dev
              </Badge>
              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">
                Optional
              </Badge>
              <Badge variant="outline" className="bg-pink-500/10 text-pink-500 hover:bg-pink-500/20">
                Peer
              </Badge>
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
                onSelectPackage={onSelectPackage}
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

