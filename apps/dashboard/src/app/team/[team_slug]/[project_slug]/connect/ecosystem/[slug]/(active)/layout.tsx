import { EcosystemLayoutSlug } from "../../../../../../../(dashboard)/dashboard/connect/ecosystem/[slug]/(active)/EcosystemSlugLayout";

export default async function Layout(props: {
  params: { team_slug: string; project_slug: string; slug: string };
  children: React.ReactNode;
}) {
  const { team_slug, project_slug } = props.params;
  return (
    <EcosystemLayoutSlug
      params={props.params}
      ecosystemLayoutPath={`/team/${team_slug}/${project_slug}/connect/ecosystem`}
    >
      {props.children}
    </EcosystemLayoutSlug>
  );
}

// because cookies() is used
export const dynamic = "force-dynamic";
