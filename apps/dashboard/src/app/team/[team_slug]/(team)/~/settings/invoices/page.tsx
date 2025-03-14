import { getTeamInvoices } from "@/actions/stripe-actions";
import { getTeamBySlug } from "@/api/team";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <Card>
      <CardHeader>
        <CardTitle>Invoice History</CardTitle>
        <CardDescription className="mt-2">
          View your past invoices and payment history
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BillingHistory invoices={invoices.data} hasMore={invoices.has_more} />
      </CardContent>
    </Card>
  );
}
