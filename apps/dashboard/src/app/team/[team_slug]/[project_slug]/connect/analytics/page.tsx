import { getProject } from "@/api/projects";
import { ConnectSDKCard } from "components/shared/ConnectSDKCard";
import { notFound } from "next/navigation";
import { ConnectAnalyticsDashboard } from "./ConnectAnalyticsDashboard";

export default async function Page(props: {
  params: {
    team_slug: string;
    project_slug: string;
  };
}) {
  const project = await getProject(
    props.params.team_slug,
    props.params.project_slug,
  );

  if (!project) {
    notFound();
  }

  return (
    <div>
      <div>
        <h1 className="mb-1 font-semibold text-2xl tracking-tight md:text-3xl">
          Connect Analytics
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Visualize how your users are connecting to your app
        </p>
      </div>

      <div className="h-6 lg:h-8" />
      <ConnectAnalyticsDashboard
        clientId={project.publishableKey}
        connectLayoutSlug={`/team/${props.params.team_slug}/${props.params.project_slug}/connect`}
      />
      <div className="h-4 lg:h-8" />
      <ConnectSDKCard description="Add the Connect SDK to your app to get started collecting analytics." />
    </div>
  );
}
