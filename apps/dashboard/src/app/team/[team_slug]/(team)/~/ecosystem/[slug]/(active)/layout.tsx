import { EcosystemLayoutSlug } from "./components/EcosystemSlugLayout";

export default async function Layout(props: {
  params: Promise<{ team_slug: string; slug: string }>;
  children: React.ReactNode;
}) {
  const { team_slug } = await props.params;
  return (
    <EcosystemLayoutSlug
      params={await props.params}
      ecosystemLayoutPath={`/team/${team_slug}/~/ecosystem`}
    >
      {props.children}
    </EcosystemLayoutSlug>
  );
}
