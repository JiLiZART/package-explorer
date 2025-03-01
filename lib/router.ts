import { createRouter } from "@tanstack/react-router"
import { rootRoute } from "./routes/root"
import { indexRoute } from "./routes/index"
import { packageRoute } from "./routes/package"

const routeTree = rootRoute.addChildren([indexRoute, packageRoute])

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

