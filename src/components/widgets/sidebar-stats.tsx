

export function SidebarStats({ total, direct, optional, types }: { total: number, direct: number, optional: number, types: number }) {
    return (
        <div className="grid grid-cols-2 gap-2 px-2 mb-2">
            <div className="flex flex-col text-xs">
                <span className="font-medium">{total}</span>
                <span className="text-muted-foreground">total</span>
            </div>
            <div className="flex flex-col text-xs">
                <span className="font-medium">{direct}</span>
                <span className="text-muted-foreground">direct</span>
            </div>
            <div className="flex flex-col text-xs">
                <span className="font-medium">{optional}</span>
                <span className="text-muted-foreground">optional</span>
            </div>
            <div className="flex flex-col text-xs">
                <span className="font-medium">{types}</span>
                <span className="text-muted-foreground">types</span>
            </div>
        </div>
    )
}
