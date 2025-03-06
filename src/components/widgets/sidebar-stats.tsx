export function SidebarStats({ total, direct, optional, types }: {
    total: number,
    direct: number,
    optional: number,
    types: number
}) {
    const items = [
        { value: total, label: 'total', icon: '📦' },
        { value: direct, label: 'direct', icon: '📦' },
        { value: optional, label: 'optional', icon: '📦' },
        { value: types, label: 'types', icon: '📦' }
    ]

    return (
        <div className="grid grid-cols-4 gap-2 px-2 mb-2">
            {items.map(({ value, label, icon }) => (
                <div className="flex flex-col text-xs">
                    <span className="font-medium">{value}{' '}{icon}</span>
                    <span className="text-muted-foreground">{label}</span>
                </div>
            ))}
        </div>
    )
}
