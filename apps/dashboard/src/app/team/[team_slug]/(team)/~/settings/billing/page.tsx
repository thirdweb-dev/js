import { getTeamBySlug } from "@/api/team";
import { getTeamSubscriptions } from "@/api/team-subscription";
import { redirect } from "next/navigation";
import { Billing } from "../../../../../../../components/settings/Account/Billing";
import { getValidAccount } from "../../../../../../account/settings/getAccount";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
  }>;
}) {
  const params = await props.params;
  const pagePath = `/team/${params.team_slug}/settings/billing`;

  // ensure that user is logged in and onboarded
  await getValidAccount(pagePath);

  const team = await getTeamBySlug(params.team_slug);

  if (!team) {
    redirect("/team");
  }

  const subscriptions = await getTeamSubscriptions(team.slug);

  if (!subscriptions) {
    return (
      <div className="flex min-h-[350px] items-center justify-center rounded-lg border p-4 text-destructive-text">
        Something went wrong. Please try again later.
      </div>
    );
  }

  return <Billing team={team} subscriptions={subscriptions} />;
}
