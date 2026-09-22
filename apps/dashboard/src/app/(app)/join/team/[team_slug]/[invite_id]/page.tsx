import { notFound, redirect } from "next/navigation";
import { getValidAccount } from "@/api/account/get-account";
import { getTeamBySlug, service_getTeamBySlug } from "@/api/team/get-team";
import { getTeamInvite } from "@/api/team/team-invites";
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

  // a member can still hold a pending invite, e.g. for a different role
  if (userTeam) {
    const invite = await getTeamInvite(userTeam.id, invite_id);
    if (invite?.status !== "pending") {
      redirect(`/team/${team_slug}`);
    }
  }

  if (!inviteTeam) {
    notFound();
  }

  return <JoinTeamPage inviteId={invite_id} team={inviteTeam} />;
}
