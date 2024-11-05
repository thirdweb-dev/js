import { EcosystemPermissionsPage } from "../../../../../../../../(dashboard)/dashboard/connect/ecosystem/[slug]/(active)/configuration/components/client/EcosystemPermissionsPage";

export default function Page({ params }: { params: { slug: string } }) {
  return <EcosystemPermissionsPage params={params} />;
}
