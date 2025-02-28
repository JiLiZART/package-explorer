"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import type { PackageData } from "@/types/package-types"

interface PackageAnalysisProps {
  packageData: PackageData
  selectedPackage: string | null
}

export function PackageAnalysis({ packageData, selectedPackage }: PackageAnalysisProps) {
  if (!selectedPackage) {
    return (
      <div className="border-l h-full bg-muted/20 p-4">
        <h2 className="text-lg font-semibold mb-4">📊 Package Analysis</h2>
        <p className="text-muted-foreground text-sm">Select a package to view detailed analysis</p>
      </div>
    )
  }

  const packageInfo = packageData.packages?.[`node_modules/${selectedPackage}`]

  if (!packageInfo) {
    return (
      <div className="border-l h-full bg-muted/20 p-4">
        <h2 className="text-lg font-semibold mb-4">📊 Package Analysis</h2>
        <p className="text-muted-foreground text-sm">Package information not found</p>
      </div>
    )
  }

  // Find packages that depend on this one
  const dependents = Object.entries(packageData.packages || {})
    .filter(([_, pkg]) => {
      const deps = {
        ...pkg.dependencies,
        ...pkg.devDependencies,
        ...pkg.peerDependencies,
        ...pkg.optionalDependencies,
      }
      return deps && selectedPackage in deps
    })
    .map(([path]) => path.replace("node_modules/", ""))

  return (
    <div className="border-l h-full bg-muted/20 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">📊 Package Analysis</h2>

        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="font-semibold">{selectedPackage}</h3>
              <Badge className="bg-blue-500/10 text-blue-500">Regular dependency</Badge>
              <p className="text-sm text-muted-foreground">v{packageInfo.version}</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">{Object.keys(packageInfo.dependencies || {}).length}</span>
              <span className="text-xs text-muted-foreground">Dependencies</span>
              <Badge variant="outline" className="mt-1">
                Direct
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">{dependents.length}</span>
              <span className="text-xs text-muted-foreground">Required By</span>
              <Badge variant="outline" className="mt-1 bg-purple-500/10 text-purple-500">
                Dependents
              </Badge>
            </CardContent>
          </Card>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Install Path</h3>
          <div className="flex items-center gap-2 bg-background rounded-md p-2 text-sm">
            <code>node_modules/{selectedPackage}</code>
            <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto">
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Required By</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[300px] overflow-y-auto">
              {dependents.length > 0 ? (
                <ul className="space-y-1">
                  {dependents.map((dep, index) => (
                    <li key={index} className="text-sm py-1 border-b last:border-0">
                      {dep}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No dependents found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

