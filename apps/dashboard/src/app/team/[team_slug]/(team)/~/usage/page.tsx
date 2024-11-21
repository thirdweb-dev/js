import { getTeamBySlug } from "@/api/team";
import { getTeamSubscriptions } from "@/api/team-subscription";
import { redirect } from "next/navigation";
import { getValidAccount } from "../../../../../account/settings/getAccount";
import { getAccountUsage } from "./getAccountUsage";
import { Usage } from "./overview/components/Usage";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
  }>;
}) {
  const params = await props.params;
  const account = await getValidAccount(`/team/${params.team_slug}/~/usage`);
  const team = await getTeamBySlug(params.team_slug);

  if (!team) {
    redirect("/team");
  }

  const [accountUsage, subscriptions] = await Promise.all([
    getAccountUsage(),
    getTeamSubscriptions(team.slug),
  ]);

  if (!accountUsage || !subscriptions) {
    return (
      <div className="flex min-h-[350px] items-center justify-center rounded-lg border p-4 text-destructive-text">
        Something went wrong. Please try again later.
      </div>
    );
  }

  return (
    <Usage
      // TODO - remove accountUsage when we have all the data available from team
      usage={accountUsage}
      subscriptions={subscriptions}
      account={account}
      team={team}
    />
  );
}
