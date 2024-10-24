import { EcosystemLayoutSlug } from "./EcosystemSlugLayout";

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;

  const { children } = props;

  return (
    <EcosystemLayoutSlug
      params={params}
      ecosystemLayoutPath="/dashboard/connect/ecosystem"
    >
      {children}
    </EcosystemLayoutSlug>
  );
}
