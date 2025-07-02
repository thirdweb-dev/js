import { notFound } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getSupportTicketsByTeam, type SupportTicket } from "@/api/support";
import { getTeamBySlug } from "@/api/team";
import SupportCasesClient from "./_components/SupportCasesClient";

export default async function Page(props: {
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

  // Fetch real support tickets for this team using team slug
  let supportTickets: SupportTicket[] = [];

  try {
    // Add a timeout to prevent hanging
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Request timeout")), 10000); // 10 second timeout
    });

    const ticketsPromise = getSupportTicketsByTeam(params.team_slug, token);
    console.log(`[Support Page] Tickets promise created`);

    supportTickets = await Promise.race([ticketsPromise, timeoutPromise]);
  } catch (error) {
    // Return empty array instead of crashing the page
    supportTickets = [];
  }

  return (
    <SupportCasesClient
      authToken={token}
      team={team}
      tickets={supportTickets}
    />
  );
}
