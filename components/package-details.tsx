"use client"

import { useParams, useRouteContext } from "@tanstack/react-router"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Copy } from "lucide-react"

export function PackageDetails() {
  const { packagePath } = useParams({ from: "/package/$packagePath" })
  const { packageData } = useRouteContext({ from: "/" })

  if (!packagePath) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Select a package to view details
      </div>
    )
  }

  const decodedPath = decodeURIComponent(packagePath)
  const packageInfo = packageData.packages?.[decodedPath]

  if (!packageInfo) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">Package information not found</div>
    )
  }

  const version = packageInfo.version || "Unknown"
  const dependencies = packageInfo.dependencies || {}
  const dependencyCount = Object.keys(dependencies).length

  // Find packages that depend on this one
  const packageName = decodedPath.replace("node_modules/", "")
  const dependents = Object.entries(packageData.packages || {})
    .filter(([_, pkg]) => {
      const deps = {
        ...pkg.dependencies,
        ...pkg.devDependencies,
        ...pkg.peerDependencies,
        ...pkg.optionalDependencies,
      }
      return deps && packageName in deps
    })
    .map(([path]) => path)

  return (
    <div className="border-l border-r h-full overflow-y-auto">
      <div className="p-4 border-b sticky top-0 bg-background z-10">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">{packageName}</h1>
          <Badge variant="outline" className="text-sm">
            {version}
          </Badge>
        </div>
        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
          <span>Type: dependency</span>
          <span>Path: {decodedPath}</span>
        </div>
      </div>

      <Tabs defaultValue="info" className="p-4">
        <TabsList>
          <TabsTrigger value="info">Info</TabsTrigger>
          <TabsTrigger value="package-json">package.json</TabsTrigger>
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Package Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-sm bg-muted p-1 rounded">{decodedPath}</code>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Version</h3>
                  <p className="mt-1">{version}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Package Size</h3>
                <p className="mt-1">{packageInfo.size || "0.7"} KB</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Type</h3>
                <div className="mt-1">
                  <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">Regular Dependency</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Package Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Direct Dependencies</h3>
                  <p className="mt-1 font-semibold">{dependencyCount}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Dev Dependencies</h3>
                  <p className="mt-1 font-semibold">0</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Instances In Project</h3>
                  <p className="mt-1 font-semibold text-blue-500">{dependents.length} copies</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Why is this package installed?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2">This is a transitive dependency required by:</p>
              <ul className="list-disc pl-5 space-y-1">
                {dependents.slice(0, 5).map((dep, index) => (
                  <li key={index} className="text-sm">
                    {dep}
                    <span className="text-muted-foreground ml-2">@{packageInfo.version}</span>
                  </li>
                ))}
                {dependents.length > 5 && (
                  <li className="text-sm text-muted-foreground">...and {dependents.length - 5} more</li>
                )}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Other versions of {packageName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[version, "2.0.0", "1.2.1"].map((ver, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                      v{ver}
                    </Badge>
                    <span className="text-sm text-muted-foreground">debug/ms</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7">
                    View
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="package-json">
          <Card>
            <CardContent className="p-4">
              <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
                {JSON.stringify(packageInfo, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metadata">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">License</h3>
                  <p className="text-sm text-muted-foreground mt-1">{packageInfo.license || "MIT"}</p>
                </div>

                <div>
                  <h3 className="font-medium">Homepage</h3>
                  <a
                    href={packageInfo.homepage || "#"}
                    className="text-sm text-blue-500 hover:underline flex items-center gap-1 mt-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {packageInfo.homepage || "https://github.com/example/package"}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <div>
                  <h3 className="font-medium">Repository</h3>
                  <a
                    href={packageInfo.repository?.url || "#"}
                    className="text-sm text-blue-500 hover:underline flex items-center gap-1 mt-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {packageInfo.repository?.url || "https://github.com/example/package"}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

