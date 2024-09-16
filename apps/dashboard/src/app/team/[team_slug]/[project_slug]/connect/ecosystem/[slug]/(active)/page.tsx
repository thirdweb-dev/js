import { EcosystemPermissionsPage } from "../../../../../../../(dashboard)/dashboard/connect/ecosystem/[slug]/(active)/EcosystemPermissionsPage";

export default function Page({ params }: { params: { slug: string } }) {
  return <EcosystemPermissionsPage params={params} />;
}
