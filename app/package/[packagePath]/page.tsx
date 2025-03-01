import { PackageDetails } from "@/components/package-details";

export default function PackagePage({
  params,
}: {
  params: { packagePath: string };
}) {
  const { packagePath } = params;

  return <PackageDetails packagePath={packagePath} />;
}
