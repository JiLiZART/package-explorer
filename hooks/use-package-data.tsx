"use client"

import { useState } from "react"
import type { PackageData } from "@/types/package-types"

export function usePackageData() {
  const [packageData, setPackageData] = useState<PackageData>({})
  const [isLoaded, setIsLoaded] = useState(false)

  const loadPackageData = (data: any) => {
    setPackageData(data)
    setIsLoaded(true)
  }

  return {
    packageData,
    loadPackageData,
    isLoaded,
  }
}

