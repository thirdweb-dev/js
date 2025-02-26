import { getTeamBySlug, service_getTeamBySlug } from "@/api/team";
import { notFound, redirect } from "next/navigation";
import { getValidAccount } from "../../../../account/settings/getAccount";
import { JoinTeamPage } from "./JoinTeamPage";

export default async function Page(props: {
  params: Promise<{ team_slug: string; invite_id: string }>;
}) {
  const { team_slug, invite_id } = await props.params;

  // ensure the user is logged in + onboarded
  await getValidAccount(`/join/team/${team_slug}/${invite_id}`);

  const [userTeam, inviteTeam] = await Promise.all([
    getTeamBySlug(team_slug),
    service_getTeamBySlug(team_slug),
  ]);

  // if the user is already a member of the team, redirect to the team
  if (userTeam) {
    redirect(`/team/${team_slug}`);
  }

  if (!inviteTeam) {
    notFound();
  }

  return <JoinTeamPage team={inviteTeam} inviteId={invite_id} />;
}
