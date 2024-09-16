import { EcosystemCreatePage } from "../../../../../../(dashboard)/dashboard/connect/ecosystem/create/EcosystemCreatePage";

export default function Page(props: {
  params: { team_slug: string; project_slug: string };
}) {
  const { team_slug, project_slug } = props.params;
  return (
    <EcosystemCreatePage
      ecosystemLayoutPath={`/team/${team_slug}/${project_slug}/connect/ecosystem`}
    />
  );
}
