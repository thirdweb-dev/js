import { getProject } from "@/api/projects";
import { PayAnalytics } from "components/pay/PayAnalytics/PayAnalytics";
import { redirect } from "next/navigation";
import {
  ResponsiveSearchParamsProvider,
  ResponsiveSuspense,
} from "responsive-rsc";
import { Spinner } from "../../../../../../../@/components/ui/Spinner/Spinner";
import { PayAnalyticsFilter } from "../../../../../../../components/pay/PayAnalytics/components/PayAnalyticsFilter";
import { getUniversalBridgeFiltersFromSearchParams } from "../../../../../../../lib/time";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
    project_slug: string;
  }>;
  searchParams: {
    from?: string | undefined | string[];
    to?: string | undefined | string[];
    interval?: string | undefined | string[];
  };
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
    <ResponsiveSearchParamsProvider value={props.searchParams}>
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
      </div>
    </ResponsiveSearchParamsProvider>
  );
}
