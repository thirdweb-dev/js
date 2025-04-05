import { getTeamInvoices } from "@/actions/stripe-actions";
import { getTeamBySlug } from "@/api/team";
import { redirect } from "next/navigation";
import type { SearchParams } from "nuqs/server";
import { getValidAccount } from "../../../../../../account/settings/getAccount";
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
  });

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <div className="p-6">
        <h2 className="font-semibold text-2xl leading-none tracking-tight">
          Invoice History
        </h2>
        <p className="mt-1 text-muted-foreground text-sm">
          View your past invoices and payment history
        </p>
      </div>
      <BillingHistory invoices={invoices.data} hasMore={invoices.has_more} />
    </div>
  );
}
