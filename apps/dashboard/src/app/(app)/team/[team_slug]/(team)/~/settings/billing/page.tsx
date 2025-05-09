import { getTeamBySlug } from "@/api/team";
import { getTeamSubscriptions } from "@/api/team-subscription";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { Billing } from "components/settings/Account/Billing";
import { redirect } from "next/navigation";
import { getValidAccount } from "../../../../../../account/settings/getAccount";
import { getAuthToken } from "../../../../../../api/lib/getAuthToken";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
  }>;
}) {
  const params = await props.params;
  const pagePath = `/team/${params.team_slug}/settings/billing`;

  const [account, team, authToken] = await Promise.all([
    getValidAccount(pagePath),
    getTeamBySlug(params.team_slug),
    getAuthToken(),
  ]);

  if (!team) {
    redirect("/team");
  }

  const subscriptions = await getTeamSubscriptions(team.slug);

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: team.id,
  });

  if (!subscriptions) {
    return (
      <div className="flex min-h-[350px] items-center justify-center rounded-lg border p-4 text-destructive-text">
        Something went wrong. Please try again later.
      </div>
    );
  }

  return (
    <Billing
      team={team}
      subscriptions={subscriptions}
      twAccount={account}
      client={client}
    />
  );
}
