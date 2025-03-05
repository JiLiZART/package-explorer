import { createFileRoute } from '@tanstack/react-router'
import { PackageDetails } from "@/components/package-details";

export const Route = createFileRoute('/$packageName')({
  component: PackageComponent,
})

function PackageComponent() {
  // In a component!
  const { packageName } = Route.useParams()

  return <PackageDetails packageName={decodeURIComponent(packageName)} />;
}
