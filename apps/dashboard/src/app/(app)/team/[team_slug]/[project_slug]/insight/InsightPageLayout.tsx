"use client";

import { TabPathLinks } from "@/components/ui/tabs";
import { FooterLinksSection } from "../components/footer/FooterLinksSection";

export function InsightPageLayout(props: {
  projectSlug: string;
  projectId: string;
  teamSlug: string;
  children: React.ReactNode;
}) {
  const insightLayoutSlug = `/team/${props.teamSlug}/${props.projectSlug}/insight`;

  return (
    <div className="flex grow flex-col">
      {/* header */}
      <div className="pt-4 lg:pt-6">
        <div className="container flex max-w-7xl flex-col gap-4">
          <div>
            <h1 className="mb-1 font-semibold text-2xl tracking-tight lg:text-3xl">
              Insight
            </h1>
            <p className="text-muted-foreground text-sm">
              APIs to retrieve blockchain data from any EVM chain, enrich it
              with metadata, and transform it using custom logic
            </p>
          </div>
        </div>

        <div className="h-4" />

        {/* Nav */}
        <TabPathLinks
          scrollableClassName="container max-w-7xl"
          links={[
            {
              name: "Overview",
              path: `${insightLayoutSlug}`,
              exactMatch: true,
            },
            {
              name: "Webhooks",
              path: `${insightLayoutSlug}/webhooks`,
            },
          ]}
        />
      </div>

      {/* content */}
      <div className="h-6" />
      <div className="container flex max-w-7xl grow flex-col gap-6">
        <div>{props.children}</div>
      </div>
      <div className="h-20" />

      {/* footer */}
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
