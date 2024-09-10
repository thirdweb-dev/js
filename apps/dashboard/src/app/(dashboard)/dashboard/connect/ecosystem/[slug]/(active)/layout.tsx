import { EcosystemLayoutSlug } from "./EcosystemSlugLayout";

export default async function Layout({
  children,
  params,
}: { children: React.ReactNode; params: { slug: string } }) {
  return (
    <EcosystemLayoutSlug
      params={params}
      ecosystemLayoutPath="/dashboard/connect/ecosystem"
    >
      {children}
    </EcosystemLayoutSlug>
  );
}

// because cookies() is used
export const dynamic = "force-dynamic";
