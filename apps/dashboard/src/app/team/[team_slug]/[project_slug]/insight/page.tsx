import { isProjectActive } from "@/api/analytics";
import { getProject } from "@/api/projects";
import { getTeamBySlug } from "@/api/team";
import { notFound } from "next/navigation";
import { FooterLinksSection } from "../components/footer/FooterLinksSection";
import { BlueprintCard } from "./blueprint-card";
import { InsightFTUX } from "./insight-ftux";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
    project_slug: string;
  }>;
}) {
  const params = await props.params;

  const [team, project] = await Promise.all([
    getTeamBySlug(params.team_slug),
    getProject(params.team_slug, params.project_slug),
  ]);

  if (!team || !project) {
    notFound();
  }

  const activeResponse = await isProjectActive({
    teamId: team.id,
    projectId: project.id,
  });

  const showFTUX = !activeResponse.insight;

  return (
    <div className="flex grow flex-col">
      {/* header */}
      <div className="border-b py-10">
        <div className="container max-w-7xl">
          <h1 className="mb-1 font-semibold text-3xl tracking-tight">
            Insight
          </h1>
          <p className="text-muted-foreground text-sm">
            APIs to retrieve blockchain data from any EVM chain, enrich it with
            metadata, and transform it using custom logic
          </p>
        </div>
      </div>

      <div className="h-6" />

      <div className="container flex max-w-7xl grow flex-col">
        {showFTUX ? (
          <InsightFTUX clientId={project.publishableKey} />
        ) : (
          <BlueprintCard />
        )}
      </div>

      <div className="h-20" />
      <div className="border-t">
        <div className="container max-w-7xl">
          <InsightFooter />
        </div>
      </div>
    </div>
  );
}

function InsightFooter() {
  return (
    <FooterLinksSection
      left={{
        title: "Documentation",
        links: [
          {
            label: "Overview",
            href: "https://portal.thirdweb.com/insight",
          },
          {
            label: "API Reference",
            href: "https://insight-api.thirdweb.com/reference",
          },
        ],
      }}
      center={{
        title: "Tutorials",
        links: [
          {
            label:
              "Blockchain Data on Any EVM - Quick and Easy REST APIs for Onchain Data",
            href: "https://www.youtube.com/watch?v=U2aW7YIUJVw",
          },
          {
            label: "Build a Whale Alerts Telegram Bot with Insight",
            href: "https://www.youtube.com/watch?v=HvqewXLVRig",
          },
        ],
      }}
      right={{
        title: "Demos",
        links: [
          {
            label: "API Playground",
            href: "https://playground.thirdweb.com/insight",
          },
        ],
      }}
      trackingCategory="insight"
    />
  );
}
