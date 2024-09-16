import { getProject } from "@/api/projects";
import { notFound } from "next/navigation";
import { ConnectAnalyticsDashboard } from "./ConnectAnalyticsDashboard";
import { ConnectSDKCard } from "./_components/ConnectSDKCard";

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
    <div className="pb-10 max-sm:pt-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-1">
          Connect Analytics
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Visualize how your users are connecting to your app
        </p>
      </div>

      <div className="h-6 lg:h-8" />
      <ConnectAnalyticsDashboard clientId={project.publishableKey} />
      <div className="h-4 lg:h-8" />
      <ConnectSDKCard />
    </div>
  );
}
