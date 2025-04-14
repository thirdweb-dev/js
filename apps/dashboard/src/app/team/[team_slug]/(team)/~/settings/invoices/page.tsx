import { getTeamInvoices } from "@/actions/stripe-actions";
import { getTeamBySlug } from "@/api/team";
import { redirect } from "next/navigation";
import type { SearchParams } from "nuqs/server";
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

  const pagePath = `/team/${params.team_slug}/settings/invoices`;

  const [, team] = await Promise.all([
    // only called to verify login status etc
    getValidAccount(pagePath),
    getTeamBySlug(params.team_slug),
  ]);

  if (!team) {
    redirect("/team");
  }

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
        invoices={invoices.data}
        hasMore={invoices.has_more}
        // fall back to "all" if the status is not set
        status={searchParams.status ?? "all"}
      />
    </div>
  );
}
