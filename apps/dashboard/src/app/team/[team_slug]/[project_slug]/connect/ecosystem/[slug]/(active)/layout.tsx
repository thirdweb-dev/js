import { EcosystemLayoutSlug } from "../../../../../../../(dashboard)/dashboard/connect/ecosystem/[slug]/(active)/EcosystemSlugLayout";

export default async function Layout(props: {
  params: Promise<{ team_slug: string; project_slug: string; slug: string }>;
  children: React.ReactNode;
}) {
  const { team_slug, project_slug } = await props.params;
  return (
    <EcosystemLayoutSlug
      params={await props.params}
      ecosystemLayoutPath={`/team/${team_slug}/${project_slug}/connect/ecosystem`}
    >
      {props.children}
    </EcosystemLayoutSlug>
  );
}
