import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePackage } from "@/context/package-context";
import { PackageInfo } from "@/components/widgets/package-info";
import { PackageMetrics } from "@/components/widgets/package-metrics";
import { PackageWhy } from "@/components/widgets/package-why";
import { PackageOtherVersions } from "@/components/widgets/package-other-versions";
import { PackageMetadata } from "@/components/widgets/package-metadata";

function PackageHeader({ packageName, location, version }: { packageName: string; location: string; version: string }) {
    return (
        <div className="p-4 border-b sticky top-0 bg-background z-10">
            <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold">{packageName}</h1>
                <Badge variant="outline" className="text-sm">
                    {version}
                </Badge>
            </div>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <span>Type: dependency</span>
                <span>Path: {location}</span>
            </div>
        </div>
    )
}

function PackageJsonContent({ json }: { json: string }) {
    return (
        <Card>
            <CardContent className="p-4">
              <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
                {JSON.stringify(json, null, 2)}
              </pre>
            </CardContent>
        </Card>
    )
}

interface PackageDetailsProps {
    packageName: string;
}

export function PackageDetails({ packageName }: PackageDetailsProps) {
    if (!packageName) {
        return (
            <div className="flex items-center justify-center h-full text-muted-foreground">
                Select a package to view details
            </div>
        );
    }

    const { findPackage } = usePackage();

    const packageInfo = findPackage(packageName);

    if (!packageInfo) {
        return (
            <div className="flex items-center justify-center h-full text-muted-foreground">
                Package information not found
            </div>
        );
    }

    const version = packageInfo.version || "Unknown";
    const dependencies = packageInfo.dependencies || {};
    const dependencyCount = Object.keys(dependencies).length;

    return (
        <div className="h-full overflow-y-auto">
            <PackageHeader
                packageName={packageName}
                location={packageInfo.location}
                version={version}
            />

            <Tabs defaultValue="info" className="p-4">
                <TabsList>
                    <TabsTrigger value="info">Info</TabsTrigger>
                    <TabsTrigger value="package-json">package.json</TabsTrigger>
                    <TabsTrigger value="metadata">Metadata</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-4">

                    <PackageInfo
                        location={packageName}
                        version={version}
                        size={packageInfo?.size}
                    />

                    <PackageMetrics
                        dependencyCount={dependencyCount}
                        devCount={0}
                        copies={0}
                    />

                    <PackageWhy
                        dependents={packageInfo.dependents}
                    />

                    <PackageOtherVersions
                        packageName={packageName}
                        versions={packageInfo.otherVersions}
                    />
                </TabsContent>

                <TabsContent value="package-json">
                    <PackageJsonContent json={packageInfo.json} />
                </TabsContent>

                <TabsContent value="metadata">
                    <PackageMetadata
                        license={packageInfo.license}
                        homepage={packageInfo.homepage}
                        repository={packageInfo.repository}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
