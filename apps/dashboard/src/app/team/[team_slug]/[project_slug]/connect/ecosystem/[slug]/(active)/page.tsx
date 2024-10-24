import { EcosystemPermissionsPage } from "../../../../../../../(dashboard)/dashboard/connect/ecosystem/[slug]/(active)/configuration/components/client/EcosystemPermissionsPage";

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  return <EcosystemPermissionsPage params={params} />;
}
