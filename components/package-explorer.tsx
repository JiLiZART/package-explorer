"use client"

import { useState } from "react"
import { PackageSidebar } from "@/components/package-sidebar"
import { PackageDetails } from "@/components/package-details"
import { PackageAnalysis } from "@/components/package-analysis"
import { SidebarProvider } from "@/components/ui/sidebar"
import { usePackageData } from "@/hooks/use-package-data"
import { FileUploader } from "@/components/file-uploader"

export function PackageExplorer() {
  const { packageData, loadPackageData, isLoaded } = usePackageData()
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)

  if (!isLoaded) {
    return <FileUploader onFileLoaded={loadPackageData} />
  }

  return (
    <SidebarProvider>
      <div className="grid md:grid-cols-[260px_1fr_300px] h-screen overflow-hidden">
        <PackageSidebar
          packageData={packageData}
          selectedPackage={selectedPackage}
          onSelectPackage={setSelectedPackage}
        />
        <PackageDetails packageData={packageData} selectedPackage={selectedPackage} />
        <PackageAnalysis packageData={packageData} selectedPackage={selectedPackage} />
      </div>
    </SidebarProvider>
  )
}

