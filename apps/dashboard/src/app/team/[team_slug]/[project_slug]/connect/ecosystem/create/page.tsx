import { EcosystemCreatePage } from "../../../../../../(dashboard)/dashboard/connect/ecosystem/create/EcosystemCreatePage";

export default async function Page(
  props: {
    params: Promise<{ team_slug: string; project_slug: string }>;
  }
) {
  const { team_slug, project_slug } = (await props.params);
  return (
    <EcosystemCreatePage
      ecosystemLayoutPath={`/team/${team_slug}/${project_slug}/connect/ecosystem`}
    />
  );
}
