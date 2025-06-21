import { EcosystemLayoutSlug } from "./components/EcosystemSlugLayout";

export default async function Layout(props: {
  params: Promise<{ team_slug: string; slug: string }>;
  children: React.ReactNode;
}) {
  const { team_slug } = await props.params;
  return (
    <EcosystemLayoutSlug
      ecosystemLayoutPath={`/team/${team_slug}/~/ecosystem`}
      params={await props.params}
    >
      {props.children}
    </EcosystemLayoutSlug>
  );
}
