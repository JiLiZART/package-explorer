import { useState } from "react";
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
import { useSearchQuery } from "@/context/search-query-context";
import { useNavigate } from "@tanstack/react-router";
import { SidebarStats } from "@/components/widgets/sidebar-stats";
import { SidebarFilters } from "@/components/widgets/sidebar-filters";

export function PackageSidebar() {
  const { packageData } = usePackage();
  const { searchQuery } = useSearchQuery();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const navigate = useNavigate();
  const pathname = window.location.pathname;
  const selectedPackage = pathname ? decodeURIComponent(pathname) : null;

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const handleSelectPackage = async (packagePath: string) => {
    await navigate({
      to: `/${encodeURIComponent(packagePath)}`
    });
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
          <SidebarStats total={stats.total} direct={stats.direct} optional={stats.optional}  types={stats.dev + stats.optional + stats.peer} />
          <SidebarFilters onFilter={toggleFilter} activeFilters={activeFilters} />
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
