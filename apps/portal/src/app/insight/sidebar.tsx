import type { SideBar } from "@/components/Layouts/DocLayout";

const insightSlug = "/insight";

export const sidebar: SideBar = {
  name: "Insight",
  links: [
    {
      name: "Overview",
      href: "/insight",
    },
    {
      name: "Get Started",
      href: `${insightSlug}/get-started`,
    },
    {
      name: "Supported Chains",
      href: `${insightSlug}/supported-chains`,
    },
    {
      name: "Blueprints",
      href: `${insightSlug}/blueprints`,
    },
    {
      name: "Use cases",
      href: `${insightSlug}/use-cases`,
    },
    {
      name: "API Reference",
      href: "https://insight-api.thirdweb.com/reference",
    },
  ],
};
