import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";

type Dependency = {
    name: string;
    version: string;
}

export function PackageWhy({ dependents = [] }: { dependents: Dependency[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Why is this package installed?</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="mb-2">
                    This is a transitive dependency required by:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                    {dependents.slice(0, 5).map((dep, index) => (
                        <li key={index} className="text-sm">
                            {dep.name}
                            <span className="text-muted-foreground ml-2">
                      @{dep.version}
                    </span>
                        </li>
                    ))}
                    {dependents.length > 5 && (
                        <li className="text-sm text-muted-foreground">
                            ...and {dependents.length - 5} more
                        </li>
                    )}
                </ul>
            </CardContent>
        </Card>
    )
}
