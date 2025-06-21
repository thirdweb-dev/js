import { redirect } from "next/navigation";

// This is a redirect to preserve old links

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
    project_slug: string;
  }>;
}) {
  const params = await props.params;
  // Default to the users tab
  redirect(`/team/${params.team_slug}/${params.project_slug}/wallets`);
}
