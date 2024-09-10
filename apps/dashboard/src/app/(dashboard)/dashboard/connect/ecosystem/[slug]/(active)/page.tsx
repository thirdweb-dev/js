import { EcosystemPermissionsPage } from "./EcosystemPermissionsPage";

export default function Page({ params }: { params: { slug: string } }) {
  return <EcosystemPermissionsPage params={params} />;
}
