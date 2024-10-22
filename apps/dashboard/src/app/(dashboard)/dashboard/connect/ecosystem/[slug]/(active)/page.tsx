import { EcosystemPermissionsPage } from "./EcosystemPermissionsPage";

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  return <EcosystemPermissionsPage params={params} />;
}
