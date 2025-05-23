import { getProject } from "@/api/projects";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { PayAnalytics } from "components/pay/PayAnalytics/PayAnalytics";
import { PayAnalyticsFilter } from "components/pay/PayAnalytics/components/PayAnalyticsFilter";
import { getUniversalBridgeFiltersFromSearchParams } from "lib/time";
import { ArrowUpRightIcon } from "lucide-react";
import { redirect } from "next/navigation";
import {
  ResponsiveSearchParamsProvider,
  ResponsiveSuspense,
} from "responsive-rsc";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
    project_slug: string;
  }>;
  searchParams: Promise<{
    from?: string | undefined | string[];
    to?: string | undefined | string[];
    interval?: string | undefined | string[];
  }>;
}) {
  const params = await props.params;
  const project = await getProject(params.team_slug, params.project_slug);

  if (!project) {
    redirect(`/team/${params.team_slug}`);
  }

  const searchParams = await props.searchParams;
  const { range, interval } = getUniversalBridgeFiltersFromSearchParams({
    from: searchParams.from,
    to: searchParams.to,
    interval: searchParams.interval,
    defaultRange: "last-30",
  });

  return (
    <ResponsiveSearchParamsProvider value={searchParams}>
      <div>
        <div className="mb-4 flex justify-start">
          <PayAnalyticsFilter />
        </div>
        <ResponsiveSuspense
          searchParamsUsed={["from", "to", "interval"]}
          fallback={
            <div className="flex w-full items-center justify-center py-24">
              <Spinner className="size-8" />
            </div>
          }
        >
          <PayAnalytics
            clientId={project.publishableKey}
            projectId={project.id}
            teamId={project.teamId}
            range={range}
            interval={interval}
          />
        </ResponsiveSuspense>

        <div className="h-10" />
        <div className="relative overflow-hidden rounded-lg border-2 border-green-500/20 bg-gradient-to-br from-card/80 to-card/50 p-4 shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.02)]">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent" />
          <div className="relative flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="font-medium text-lg">
                Get Started with Universal Bridge
              </h3>
              <p className="text-muted-foreground text-sm">
                Simple, instant, and secure payments across any token and chain.
              </p>
            </div>
            <a
              href="https://portal.thirdweb.com/pay"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 font-medium text-sm text-white transition-all hover:bg-green-600/90 hover:shadow-sm"
            >
              Learn More
              <ArrowUpRightIcon className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </ResponsiveSearchParamsProvider>
  );
}
