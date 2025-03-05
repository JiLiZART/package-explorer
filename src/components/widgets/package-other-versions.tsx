import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useNavigate } from "@tanstack/react-router";

type PackageOtherVersionsProps = { packageName: string; versions: { name: string, version: string }[] }

export function PackageOtherVersions({ packageName, versions = [] }: PackageOtherVersionsProps) {
    const navigate = useNavigate();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Other versions of {packageName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                {versions.map((ver, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                        <div className="flex items-center gap-2">
                            <Badge
                                variant="outline"
                                className="bg-blue-500/10 text-blue-500"
                            >
                                {ver.version}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{ver.name}</span>
                        </div>
                        <Button onClick={() => navigate({
                            to: `/${ver.name}`
                        })} variant="ghost" size="sm" className="h-7">
                            View
                        </Button>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
