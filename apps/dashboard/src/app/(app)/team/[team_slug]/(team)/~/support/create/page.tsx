import { notFound, redirect } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getTeamBySlug } from "@/api/team";
import { CreateSupportCase } from "../_components/CreateSupportCase";

export default async function CreatePage(props: {
  params: Promise<{
    team_slug: string;
  }>;
}) {
  const params = await props.params;

  const [team, token] = await Promise.all([
    getTeamBySlug(params.team_slug),
    getAuthToken(),
  ]);

  if (!team || !token) {
    notFound();
  }

  if (team.billingPlan === "free") {
    redirect(`/team/${params.team_slug}/~/support`);
  }

  return <CreateSupportCase authToken={token} team={team} />;
}
