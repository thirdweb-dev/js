import { redirect } from "next/navigation";

// This is just a redirect to keep the old links working ( /connect/analytics -> /connect )

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
    project_slug: string;
  }>;
}) {
  const { team_slug, project_slug } = await props.params;
  redirect(`/team/${team_slug}/${project_slug}/connect`);
}
