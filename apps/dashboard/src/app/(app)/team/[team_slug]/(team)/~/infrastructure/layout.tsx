import { redirect } from "next/navigation";
import { getTeamBySlug } from "@/api/team";

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{
    team_slug: string;
  }>;
}) {
  const params = await props.params;
  const team = await getTeamBySlug(params.team_slug);
  if (!team) {
    redirect("/team");
  }
  return <div className="container py-12">{props.children}</div>;
}
