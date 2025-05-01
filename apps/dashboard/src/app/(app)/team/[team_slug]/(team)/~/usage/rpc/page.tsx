import { getTeamBySlug } from "@/api/team";
import { getLast24HoursRPCUsage } from "@/api/usage/rpc";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from "lucide-react";
import { redirect } from "next/navigation";
import { getAuthToken } from "../../../../../../api/lib/getAuthToken";
import { TeamPlanBadge } from "../../../../../../components/TeamPlanBadge";
import { loginRedirect } from "../../../../../../login/loginRedirect";
import { CountGraph } from "./components/count-graph";
import { RateGraph } from "./components/rate-graph";

export default async function RPCUsage(props: {
  params: Promise<{
    team_slug: string;
  }>;
}) {
  const params = await props.params;
  const authToken = await getAuthToken();

  if (!authToken) {
    loginRedirect(`/team/${params.team_slug}/~/usage/storage`);
  }

  const team = await getTeamBySlug(params.team_slug);
  if (!team) {
    redirect("/team");
  }

  const currentPlan = team.billingPlan;
  const currentRateLimit = team.capabilities.rpc.rateLimit;

  const apiData = await getLast24HoursRPCUsage({
    teamId: team.id,
    authToken,
  });

  if (!apiData.ok) {
    return <div>Error fetching data, please try again later</div>;
  }

  const { peakRate, totalCounts, averageRate } = apiData.data;

  // Calculate percentage of limit for the peak
  const peakPercentage = (Number(peakRate.peakRPS) / currentRateLimit) * 100;

  // Determine status based on peak percentage
  const getStatusColor = (percentage: number) => {
    if (percentage < 70) return "bg-green-500";
    if (percentage < 90) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Calculate total requests
  const totalRequests =
    Number(totalCounts.includedCount) +
    Number(totalCounts.rateLimitedCount) +
    Number(totalCounts.overageCount);

  return (
    <div className="container mx-auto space-y-8 py-6">
      <div className="flex flex-col gap-2">
        <h2 className="font-bold text-3xl tracking-tight">
          RPC Usage Dashboard
        </h2>
        <p className="text-muted-foreground">
          Monitor your RPC usage and rate limits for the last 24 hours
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-sm">
              Plan Rate Limit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="font-bold text-2xl capitalize">
                {currentRateLimit.toLocaleString()} RPS
              </div>
              <TeamPlanBadge plan={currentPlan} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-sm">Peak Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="font-bold text-2xl">
                {Number(peakRate.peakRPS)} RPS
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`h-3 w-3 rounded-full ${getStatusColor(peakPercentage)}`}
                />
                <span className="text-muted-foreground text-xs">
                  {peakPercentage > 100
                    ? `${(peakPercentage - 100).toFixed(0)}% over limit`
                    : `${peakPercentage.toFixed(0)}% of limit`}
                </span>
              </div>
            </div>
            <p className="mt-1 text-muted-foreground text-xs">
              <ClockIcon className="mr-1 inline h-3 w-3" />
              {peakRate.date
                ? format(new Date(`${peakRate.date}Z`), "MMM d, HH:mm")
                : "No Requests in last 24 hours"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-sm">
              Total Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {totalRequests.toLocaleString()}
            </div>
            <div className="mt-1 flex items-center text-muted-foreground text-xs">
              <CheckCircleIcon className="mr-1 h-3 w-3 text-green-500" />
              <span>
                {/* we count both included and overage as included */}
                {(
                  ((Number(totalCounts.includedCount) +
                    Number(totalCounts.overageCount)) /
                    Number(totalRequests)) *
                  100
                ).toFixed(1)}
                % successful requests
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-sm">Rate Limited</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {totalCounts.rateLimitedCount.toLocaleString()}
            </div>
            <div className="mt-1 flex items-center text-muted-foreground text-xs">
              <XCircleIcon className="mr-1 h-3 w-3 text-red-500" />
              <span>
                {/* if there are no requests, we show 100% success rate */}
                {totalRequests === 0
                  ? "100"
                  : (
                      (Number(totalCounts.rateLimitedCount) /
                        Number(totalRequests)) *
                      100
                    ).toFixed(1)}
                % of requests
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {peakPercentage > 100 && (
        <Alert variant="destructive">
          <AlertTriangleIcon className="h-4 w-4" />
          <AlertTitle>Rate Limit Exceeded</AlertTitle>
          <AlertDescription>
            Your peak usage of {Number(peakRate.peakRPS)} RPS has exceeded your
            plan limit of {currentRateLimit} RPS. Consider upgrading your plan
            to avoid rate limiting.
          </AlertDescription>
        </Alert>
      )}

      {peakPercentage > 80 && peakPercentage <= 100 && (
        <Alert variant="warning" className="border-yellow-500 text-yellow-700">
          <AlertTriangleIcon className="h-4 w-4" />
          <AlertTitle>Approaching Rate Limit</AlertTitle>
          <AlertDescription>
            Your peak usage is at {peakPercentage.toFixed(0)}% of your plan
            limit. You may experience rate limiting during high traffic periods.
          </AlertDescription>
        </Alert>
      )}

      <RateGraph
        peakPercentage={peakPercentage}
        currentRateLimit={currentRateLimit}
        data={averageRate}
      />

      <CountGraph
        peakPercentage={peakPercentage}
        currentRateLimit={currentRateLimit}
        data={averageRate}
      />
    </div>
  );
}
