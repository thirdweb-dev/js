import { EcosystemPermissionsPage } from "./components/client/EcosystemPermissionsPage";

export default async function Page({
  params,
}: { params: Promise<{ slug: string }> }) {
  return <EcosystemPermissionsPage params={await params} />;
}
