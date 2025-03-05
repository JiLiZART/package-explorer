import { Card, CardContent } from "@/components/ui/card.tsx";
import { ExternalLink } from "lucide-react";


export function PackageMetadata({ license, homepage, repository }: { license?: string, homepage?: string, repository?: { type: string, url: string } }) {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="space-y-4">
                    <div>
                        <h3 className="font-medium">License</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            {license || ""}
                        </p>
                    </div>

                    <div>
                        <h3 className="font-medium">Homepage</h3>
                        <a
                            href={homepage || "#"}
                            className="text-sm text-blue-500 hover:underline flex items-center gap-1 mt-1"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {homepage ||
                                "#"}
                            <ExternalLink className="h-3 w-3" />
                        </a>
                    </div>

                    <div>
                        <h3 className="font-medium">Repository</h3>
                        <a
                            href={repository?.url || "#"}
                            className="text-sm text-blue-500 hover:underline flex items-center gap-1 mt-1"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {repository?.url ||
                                ""}
                            <ExternalLink className="h-3 w-3" />
                        </a>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
