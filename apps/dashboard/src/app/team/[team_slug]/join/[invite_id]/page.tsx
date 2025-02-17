import { notFound, redirect } from "next/navigation";
import { service_getTeamBySlug } from "../../../../../@/api/team";
import { getAuthToken } from "../../../../api/lib/getAuthToken";
import { AcceptInviteCard } from "./components/accept-invite-card";

export default async function JoinTeamPage(props: {
  params: Promise<{ team_slug: string; invite_id: string }>;
}) {
  const token = await getAuthToken();

  if (!token) {
    redirect("/login");
  }

  const { team_slug, invite_id } = await props.params;

  const team = await service_getTeamBySlug(team_slug);

  console.log(team);

  if (!team) {
    notFound();
  }

  return (
    <div className="flex min-h-screen min-w-screen items-center justify-center">
      <AcceptInviteCard team={team} inviteId={invite_id} />
    </div>
  );
}
