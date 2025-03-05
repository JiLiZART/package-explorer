import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge.tsx";

export function PackageInfo({ location, version, size }: { location: string, version: string, size?: string }) {

    return (
        <Card>
            <CardHeader>
                <CardTitle>Package Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                            Location
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            <code className="text-sm bg-muted p-1 rounded">
                                {location}
                            </code>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Copy className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                            Version
                        </h3>
                        <p className="mt-1">{version}</p>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                        Package Size
                    </h3>
                    <p className="mt-1">{size || "0"} KB</p>
                </div>

                <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                        Type
                    </h3>
                    <div className="mt-1">
                        <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">
                            Regular Dependency
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
