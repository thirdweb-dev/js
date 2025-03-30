import type { SideBar } from "@/components/Layouts/DocLayout";
import {
  Album,
  Box,
  Braces,
  Brain,
  ExternalLink,
  MessageCircleQuestionIcon,
  Network,
  Rocket,
  StickyNote,
  Webhook,
  Wrench,
} from "lucide-react";

const insightSlug = "/insight";

export const sidebar: SideBar = {
  name: "Insight",
  links: [
    {
      name: "Overview",
      href: "/insight",
      icon: <Box />,
    },
    {
      name: "Use Cases",
      href: `${insightSlug}/use-cases`,
      icon: <StickyNote />,
    },
    {
      name: "Playground",
      href: "https://playground.thirdweb.com/insight",
      icon: <ExternalLink />,
    },
    {
      name: "Get Started",
      href: `${insightSlug}/get-started`,
      icon: <Rocket />,
    },
    {
      name: "Blueprints",
      href: `${insightSlug}/blueprints`,
      icon: <Album />,
    },
    {
      name: "Multichain Queries",
      href: `${insightSlug}/multichain-queries`,
      icon: <Network />,
    },
    {
      name: "Agents & LLMs",
      href: `${insightSlug}/agents-and-llms`,
      icon: <Brain />,
      links: [
        {
          name: "llms.txt",
          href: `${insightSlug}/agents-and-llms/llmstxt`,
        },
      ],
    },
    {
      name: "Webhooks",
      href: `${insightSlug}/webhooks`,
      icon: <Webhook />,
      links: [
        {
          name: "Getting Started",
          href: `${insightSlug}/webhooks`,
        },
        {
          name: "Managing Webhooks",
          href: `${insightSlug}/webhooks/managing-webhooks`,
        },
        {
          name: "Filtering",
          href: `${insightSlug}/webhooks/filtering`,
        },
        {
          name: "Payload",
          href: `${insightSlug}/webhooks/payload`,
        },
        {
          name: "API Reference",
          href: "https://insight-api.thirdweb.com/reference#tag/webhooks",
        },
      ],
    },
    {
      name: "API Reference",
      href: "https://insight-api.thirdweb.com/reference",
      icon: <Braces />,
    },
    {
      name: "Troubleshoot",
      href: `${insightSlug}/troubleshoot`,
      icon: <Wrench />,
    },
    {
      name: "FAQs",
      href: `${insightSlug}/faqs`,
      icon: <MessageCircleQuestionIcon />,
    },
  ],
};
