import { createRootRoute } from "@tanstack/react-router"
import { PackageExplorer } from "@/components/package-explorer"

export const rootRoute = createRootRoute({
  component: PackageExplorer,
})

