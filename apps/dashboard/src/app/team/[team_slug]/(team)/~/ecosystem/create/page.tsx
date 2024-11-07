import { EcosystemCreatePage } from "./EcosystemCreatePage";

export default async function Page(props: {
  params: Promise<{ team_slug: string }>;
}) {
  const { team_slug } = await props.params;
  return (
    <EcosystemCreatePage
      ecosystemLayoutPath={`/team/${team_slug}/~/ecosystem`}
    />
  );
}
