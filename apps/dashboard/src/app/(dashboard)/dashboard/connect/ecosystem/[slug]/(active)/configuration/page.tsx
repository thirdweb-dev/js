import { EcosystemPermissionsPage } from "./components/client/EcosystemPermissionsPage";

export default function Page({ params }: { params: { slug: string } }) {
  return <EcosystemPermissionsPage params={params} />;
}
