import { redirect } from "next/navigation";
import type { SearchParams } from "nuqs/server";
import { getTeamInvoices } from "@/actions/stripe-actions";
import { getTeamBySlug } from "@/api/team";
import { getMemberByAccountId } from "@/api/team-members";
import { getValidAccount } from "../../../../../../account/settings/getAccount";
import { BillingFilter } from "./components/billing-filter";
import { BillingHistory } from "./components/billing-history";
import { searchParamLoader } from "./search-params";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
  }>;
  searchParams: Promise<SearchParams>;
}) {
  const [params, searchParams] = await Promise.all([
    props.params,
    searchParamLoader(props.searchParams),
  ]);

  const pagePath = `/team/${params.team_slug}/invoices`;

  const account = await getValidAccount(pagePath);

  const [team, teamMember] = await Promise.all([
    getTeamBySlug(params.team_slug),
    getMemberByAccountId(params.team_slug, account.id),
  ]);

  if (!team) {
    redirect("/team");
  }

  const isOwnerAccount = teamMember?.role === "OWNER";

  const invoices = await getTeamInvoices(team, {
    cursor: searchParams.cursor ?? undefined,
    status: searchParams.status ?? undefined,
  });

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <div className="flex items-center justify-between p-6">
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold text-2xl leading-none tracking-tight">
            Invoice History
          </h2>
          <p className="text-muted-foreground text-sm">
            View your past invoices and payment history
          </p>
        </div>
        <BillingFilter />
      </div>
      <BillingHistory
        hasMore={invoices.has_more}
        invoices={invoices.data}
        isOwnerAccount={isOwnerAccount}
        // fall back to "all" if the status is not set
        status={searchParams.status ?? "all"}
        teamSlug={params.team_slug}
      />
    </div>
  );
}
