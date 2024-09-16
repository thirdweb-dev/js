import { EcosystemLandingPage } from "../../../../../(dashboard)/dashboard/connect/ecosystem/EcosystemLandingPage";

export default async function Page(props: {
  params: { team_slug: string; project_slug: string };
}) {
  const { team_slug, project_slug } = props.params;
  return (
    <div className="max-sm:pt-6">
      <EcosystemLandingPage
        ecosystemLayoutPath={`/team/${team_slug}/${project_slug}/connect/ecosystem`}
      />
    </div>
  );
}

// because cookies() is used
export const dynamic = "force-dynamic";
