import { createRoute } from "@tanstack/react-router"
import { rootRoute } from "./root"
import { PackageDetails } from "@/components/package-details"

export const packageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "package/$packagePath",
  component: PackageDetails,
})

