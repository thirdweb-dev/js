import { EcosystemLandingPage } from "../../../../../(dashboard)/dashboard/connect/ecosystem/EcosystemLandingPage";

export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const { team_slug, project_slug } = await props.params;
  return (
    <EcosystemLandingPage
      ecosystemLayoutPath={`/team/${team_slug}/${project_slug}/connect/ecosystem`}
    />
  );
}
