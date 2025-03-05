import { createFileRoute } from '@tanstack/react-router'
import { PackageDashboard } from "../components/package-dashboard.tsx";

export const Route = createFileRoute('/')({
    component: PackageDashboard,
})

