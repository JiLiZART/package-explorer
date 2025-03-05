import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";

export function PackageMetrics({ dependencyCount, devCount, copies }: { dependencyCount: number, devCount: number, copies: number }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Package Metrics</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                            Direct Dependencies
                        </h3>
                        <p className="mt-1 font-semibold">{dependencyCount}</p>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                            Dev Dependencies
                        </h3>
                        <p className="mt-1 font-semibold">{devCount}</p>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                            Instances In Project
                        </h3>
                        <p className="mt-1 font-semibold text-blue-500">
                            {copies} copies
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
