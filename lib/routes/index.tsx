import { createRoute } from "@tanstack/react-router"
import { rootRoute } from "./root"
import { PackageDashboard } from "@/components/package-dashboard"

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: PackageDashboard,
})

