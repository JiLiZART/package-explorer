"use client";

import { FileUploader } from "./file-uploader";
import { Header } from "./header";
import { SidebarProvider } from "./ui/sidebar";
import { PackageSidebar } from "./package-sidebar";
import { usePackage } from "@/context/package-context";
import { usePathname } from "next/navigation";
import { PackageAnalysis } from "./package-analysis";

export function PackageExplorer({ children }: { children: React.ReactNode }) {
  const { packageData, isLoaded, loadPackageData } = usePackage();
  const pathname = usePathname();

  if (!isLoaded) {
    return <FileUploader onFileLoaded={loadPackageData} />;
  }

  const packagePath = pathname.startsWith("/package/")
    ? pathname.replace("/package/", "")
    : null;

  return (
    <div className="h-screen flex flex-col min-h-screen bg-background">
      <Header />

      <SidebarProvider className="pt-[58px]">
        <PackageSidebar />

        <div
          className={`grid ${
            packagePath ? "md:grid-cols-[1fr_300px]" : "md:grid-cols-[1fr]"
          } h-screen overflow-hidden w-full`}
        >
          <div className="w-full">{children}</div>
          {packagePath && (
            <PackageAnalysis
              packageData={packageData}
              selectedPackage={decodeURIComponent(packagePath)}
            />
          )}
        </div>
      </SidebarProvider>
    </div>
  );
}
