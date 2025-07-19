import { notFound, redirect } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getTeamBySlug } from "@/api/team";
import { tryCatch } from "@/utils/try-catch";
import { SupportCaseDetails } from "../../_components/SupportCaseDetails";
import { getSupportTicket } from "../../apis/tickets";

export default async function TicketPage(props: {
  params: Promise<{
    team_slug: string;
    id: string;
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

  const ticketResult = await tryCatch(
    getSupportTicket({
      ticketId: params.id,
      teamSlug: params.team_slug,
      authToken: token,
    }),
  );

  if (ticketResult.error) {
    redirect(`/team/${params.team_slug}/~/support`);
  }

  return <SupportCaseDetails team={team} ticket={ticketResult.data} />;
}
