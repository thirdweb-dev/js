import { notFound } from "next/navigation";
import { isProjectActive } from "@/api/analytics";
import { getProject } from "@/api/projects";
import { getTeamBySlug } from "@/api/team";
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
    projectId: project.id,
    teamId: team.id,
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
      center={{
        links: [
          {
            href: "https://www.youtube.com/watch?v=U2aW7YIUJVw",
            label:
              "Blockchain Data on Any EVM - Quick and Easy REST APIs for Onchain Data",
          },
          {
            href: "https://www.youtube.com/watch?v=HvqewXLVRig",
            label: "Build a Whale Alerts Telegram Bot with Insight",
          },
        ],
        title: "Tutorials",
      }}
      left={{
        links: [
          {
            href: "https://portal.thirdweb.com/insight",
            label: "Overview",
          },
          {
            href: "https://insight-api.thirdweb.com/reference",
            label: "API Reference",
          },
        ],
        title: "Documentation",
      }}
      right={{
        links: [
          {
            href: "https://playground.thirdweb.com/insight",
            label: "API Playground",
          },
        ],
        title: "Demos",
      }}
    />
  );
}
