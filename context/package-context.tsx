"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"
import type { PackageData } from "@/types/package-types"

interface PackageContextType {
  packageData: PackageData
  loadPackageData: (data: PackageData) => void
  isLoaded: boolean
  searchQuery: string
  setSearchQuery: (query: string) => void
}

const PackageContext = createContext<PackageContextType | undefined>(undefined)

export function PackageProvider({ children }: { children: React.ReactNode }) {
  const [packageData, setPackageData] = useState<PackageData>({})
  const [isLoaded, setIsLoaded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const loadPackageData = (data: PackageData) => {
    setPackageData(data)
    setIsLoaded(true)
  }

  return (
    <PackageContext.Provider
      value={{
        packageData,
        loadPackageData,
        isLoaded,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </PackageContext.Provider>
  )
}

export function usePackage() {
  const context = useContext(PackageContext)
  if (context === undefined) {
    throw new Error("usePackage must be used within a PackageProvider")
  }
  return context
}

