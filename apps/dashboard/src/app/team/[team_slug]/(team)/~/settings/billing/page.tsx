import { getTeamBySlug } from "@/api/team";
import { redirect } from "next/navigation";
import { Billing } from "../../../../../../../components/settings/Account/Billing";
import { getAccount } from "../../../../../../account/settings/getAccount";
import { getAccountUsage } from "../../usage/getAccountUsage";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
  }>;
}) {
  const params = await props.params;

  const account = await getAccount();
  if (!account) {
    redirect(
      `/login?next=${encodeURIComponent(`/team/${params.team_slug}/settings/billing`)}`,
    );
  }

  const team = await getTeamBySlug(params.team_slug);

  if (!team) {
    redirect("/team");
  }

  const accountUsage = await getAccountUsage();

  if (!accountUsage) {
    return (
      <div className="flex min-h-[350px] items-center justify-center rounded-lg border p-4 text-destructive-text">
        Something went wrong. Please try again later.
      </div>
    );
  }

  return <Billing team={team} account={account} accountUsage={accountUsage} />;
}
