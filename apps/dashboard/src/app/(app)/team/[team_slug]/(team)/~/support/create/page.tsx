import { notFound } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getTeamBySlug } from "@/api/team";
import { getValidAccount } from "../../../../../../account/settings/getAccount";
import { CreateTicketForm } from "../_components/CreateTicketForm";

export default async function CreateTicketPage(props: {
  params: Promise<{
    team_slug: string;
  }>;
}) {
  const params = await props.params;

  const [team, token, account] = await Promise.all([
    getTeamBySlug(params.team_slug),
    getAuthToken(),
    getValidAccount(`/team/${params.team_slug}/~/support/create`),
  ]);

  if (!team || !token || !account) {
    notFound();
  }

  return (
    <CreateTicketForm
      account={account}
      authToken={token}
      team={team}
      teamSlug={params.team_slug}
    />
  );
}
