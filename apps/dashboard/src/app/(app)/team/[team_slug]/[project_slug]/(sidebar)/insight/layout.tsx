import { redirect } from "next/navigation";
import { getProject } from "@/api/projects";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { FooterLinksSection } from "../components/footer/FooterLinksSection";

export default async function Layout(props: {
  params: Promise<{
    team_slug: string;
    project_slug: string;
  }>;
  children: React.ReactNode;
}) {
  const params = await props.params;
  const project = await getProject(params.team_slug, params.project_slug);

  if (!project) {
    redirect(`/team/${params.team_slug}`);
  }

  return (
    <div className="flex grow flex-col">
      <div className="pt-4 lg:pt-6">
        <div className="container max-w-7xl">
          <h1 className="mb-1 font-semibold text-2xl tracking-tight lg:text-3xl">
            Insight
          </h1>
          <p className="max-w-3xl text-muted-foreground text-sm leading-relaxed">
            APIs to retrieve blockchain data from any EVM chain, enrich it with
            metadata, and transform it using custom logic.{" "}
            <UnderlineLink
              href="https://portal.thirdweb.com/insight"
              rel="noopener noreferrer"
              target="_blank"
            >
              Learn more
            </UnderlineLink>
          </p>
        </div>

        <div className="h-4" />
      </div>

      <div className="h-6" />
      <div className="container flex max-w-7xl grow flex-col">
        {props.children}
      </div>

      <div className="h-20" />
      <div className="border-border border-t">
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
