import { getTeamBySlug } from "@/api/team";
import { getBilledUsage } from "@/api/usage/billing-preview";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { getValidAccount } from "../../../../../account/settings/getAccount";
import {
  UsageCategoryDetails,
  formatPrice,
} from "../../_components/usage-category-details";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
  }>;
}) {
  const params = await props.params;
  const [, team] = await Promise.all([
    getValidAccount(`/team/${params.team_slug}/~/usage`),
    getTeamBySlug(params.team_slug),
  ]);

  if (!team) {
    redirect("/team");
  }

  const usagePreview = await getBilledUsage(team.slug);

  if (usagePreview.status === "error") {
    switch (usagePreview.reason) {
      case "free_plan":
        return (
          <div className="flex min-h-[350px] items-center justify-center rounded-lg border p-4 text-destructive-text">
            You are on a free plan. Please upgrade to a paid plan to view your
            usage.
          </div>
        );
      default:
        return (
          <div className="flex min-h-[350px] items-center justify-center rounded-lg border p-4 text-destructive-text">
            Something went wrong. Please try again later.
          </div>
        );
    }
  }

  const grandTotalCents = usagePreview.data.result.reduce((total, category) => {
    const categoryTotal = category.lineItems.reduce(
      (sum, item) => sum + item.amountUsdCents,
      0,
    );
    return total + categoryTotal;
  }, 0);

  // sort the categories by their sub-total
  const sortedCategories = usagePreview.data.result.sort((a, b) => {
    const aTotal = a.lineItems.reduce(
      (sum, item) => sum + item.amountUsdCents,
      0,
    );
    const bTotal = b.lineItems.reduce(
      (sum, item) => sum + item.amountUsdCents,
      0,
    );
    return bTotal - aTotal;
  });

  return (
    <div className="flex flex-col gap-8">
      {usagePreview.data.planVersion < 5 && (
        <Alert variant="warning">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Outdated Plan</AlertTitle>
          <AlertDescription>
            <p>
              You are on an outdated plan. Some of this information may be
              inaccurate.
            </p>
          </AlertDescription>
        </Alert>
      )}
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col items-start text-xl">
            Usage Summary
          </CardTitle>
          <CardDescription>
            {format(parseISO(usagePreview.data.periodStart), "MMM d, yyyy")} -{" "}
            {format(parseISO(usagePreview.data.periodEnd), "MMM d, yyyy")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="font-semibold text-3xl text-foreground">
            {formatPrice(grandTotalCents, { inCents: true })}
          </div>
          <p className="mt-1 text-muted-foreground text-sm">
            Total estimated cost based on usage in the current billing period so
            far.
          </p>
        </CardContent>
        <CardFooter>
          <Alert variant="info">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Billing Thresholds and Discounts</AlertTitle>
            <AlertDescription>
              <p>
                Partial payments due to billing thresholds as well as discounts
                are not reflected in this estimate.
                <br />
                This means the invoice you receive at the end of the billing
                period may be lower.
              </p>
            </AlertDescription>
          </Alert>
        </CardFooter>
      </Card>

      <div className="space-y-6">
        {sortedCategories.map((category, index) => (
          <UsageCategoryDetails
            key={`${category.category}_${index}`}
            category={category}
          />
        ))}
      </div>
    </div>
  );
}
