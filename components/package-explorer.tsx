"use client";
import { Outlet, useRouter } from "@tanstack/react-router";
import { PackageSidebar } from "@/components/package-sidebar";
import { PackageAnalysis } from "@/components/package-analysis";
import { SidebarProvider } from "@/components/ui/sidebar";
import { usePackageData } from "@/hooks/use-package-data";
import { FileUploader } from "@/components/file-uploader";

export function PackageExplorer() {
  const { packageData, loadPackageData, isLoaded } = usePackageData();
  const router = useRouter();

  console.log({ router });
  const packagePath = router.state?.currentLocation
    ? router.state?.currentLocation?.pathname.split("/package/")[1]
    : null;

  if (!isLoaded) {
    return <FileUploader onFileLoaded={loadPackageData} />;
  }

  return (
    <SidebarProvider>
      <div
        className={`grid ${
          packagePath
            ? "md:grid-cols-[320px_1fr_300px]"
            : "md:grid-cols-[320px_1fr]"
        } h-screen overflow-hidden`}
      >
        <PackageSidebar
          packageData={packageData}
          selectedPackage={packagePath ? decodeURIComponent(packagePath) : null}
        />
        <Outlet context={{ packageData }} />
        {packagePath && (
          <PackageAnalysis
            packageData={packageData}
            selectedPackage={decodeURIComponent(packagePath)}
          />
        )}
      </div>
    </SidebarProvider>
  );
}
