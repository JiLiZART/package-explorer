import { cva } from "class-variance-authority";

const btn = cva(
    "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default: "",
                blue: "bg-blue-500/10 text-blue-500 border-transparent hover:bg-blue-500/20",
                purple: "bg-purple-500/10 text-purple-500 border-transparent hover:bg-purple-500/20",
                yellow: "bg-yellow-500/10 text-yellow-500 border-transparent hover:bg-yellow-500/20",
                pink: "bg-pink-500/10 text-pink-500 border-transparent hover:bg-pink-500/20",
            },
            active: {
                true: "text-white border-transparent",
                false: "border-transparent"
            },
        },
        compoundVariants: [
            {
                variant: "blue",
                active: true,
                class: "bg-blue-500"
            },
            {
                variant: "purple",
                active: true,
                class: "bg-purple-500"
            },
            {
                variant: "yellow",
                active: true,
                class: "bg-yellow-500"
            },
            {
                variant: "pink",
                active: true,
                class: "bg-pink-500"
            },
        ],
        defaultVariants: {
            variant: "default",
            active: false,
        },
    }
);

export function SidebarFilters({ activeFilters, onFilter }: { activeFilters: string[], onFilter: (filter: string) => void }) {
    return (
        <div className="flex gap-2 px-2">
            <button
                onClick={() => onFilter("regular")}
                className={btn({ active: activeFilters.includes("regular"), variant: "blue" })}
            >
                Regular
            </button>
            <button
                onClick={() => onFilter("dev")}
                className={btn({ active: activeFilters.includes("dev"), variant: "purple" })}
            >
                Dev
            </button>
            <button
                onClick={() => onFilter("optional")}
                className={btn({ active: activeFilters.includes("optional"), variant: "yellow" })}
            >
                Optional
            </button>
            <button
                onClick={() => onFilter("peer")}
                className={btn({ active: activeFilters.includes("peer"), variant: "pink" })}
            >
                Peer
            </button>
        </div>
    )
}
