"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarRail,
} from "@/components/ui/sidebar";
import { PackageTree } from "@/components/package-tree";
import { usePackage } from "@/context/package-context";
import { useSearchQuery } from "@/contexts/search-query-context";

export function PackageSidebar() {
  const { packageData } = usePackage();
  const { searchQuery } = useSearchQuery();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const selectedPackage = pathname.startsWith("/package/")
    ? decodeURIComponent(pathname.replace("/package/", ""))
    : null;

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const handleSelectPackage = (packagePath: string) => {
    router.push(`/package/${encodeURIComponent(packagePath)}`);
  };

  const stats = {
    total: Object.keys(packageData.packages || {}).length,
    direct: Object.keys(packageData.dependencies || {}).length,
    dev: Object.keys(packageData.devDependencies || {}).length,
    optional: Object.keys(packageData.optionalDependencies || {}).length,
    peer: Object.keys(packageData.peerDependencies || {}).length,
  };

  return (
    <Sidebar side="left">
      <SidebarHeader className="mt-[58px]">
        <div className="p-2">
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
          <div className="flex gap-2 px-2">
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
        </div>
      </SidebarHeader>
      <SidebarContent>
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
  );
}
