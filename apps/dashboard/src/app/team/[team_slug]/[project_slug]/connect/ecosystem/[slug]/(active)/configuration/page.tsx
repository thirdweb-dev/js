import { EcosystemPermissionsPage } from "../../../../../../../../(dashboard)/dashboard/connect/ecosystem/[slug]/(active)/configuration/components/client/EcosystemPermissionsPage";

export default async function Page({
  params,
}: { params: Promise<{ slug: string }> }) {
  return <EcosystemPermissionsPage params={await params} />;
}
