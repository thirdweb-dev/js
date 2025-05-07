import type { SideBar } from "@/components/Layouts/DocLayout";
import {
  AlbumIcon,
  BoxIcon,
  BracesIcon,
  BrainIcon,
  ExternalLinkIcon,
  MessageCircleQuestionIcon,
  NetworkIcon,
  RocketIcon,
  StickyNoteIcon,
  WebhookIcon,
  WrenchIcon,
} from "lucide-react";

const insightSlug = "/insight";

export const sidebar: SideBar = {
  name: "Insight",
  links: [
    {
      name: "Overview",
      href: "/insight",
      icon: <BoxIcon />,
    },
    {
      name: "Use Cases",
      href: `${insightSlug}/use-cases`,
      icon: <StickyNoteIcon />,
    },
    {
      name: "Playground",
      href: "https://playground.thirdweb.com/insight",
      icon: <ExternalLinkIcon />,
    },
    {
      name: "Get Started",
      href: `${insightSlug}/get-started`,
      icon: <RocketIcon />,
    },
    {
      name: "Blueprints",
      href: `${insightSlug}/blueprints`,
      icon: <AlbumIcon />,
    },
    {
      name: "Multichain Queries",
      href: `${insightSlug}/multichain-queries`,
      icon: <NetworkIcon />,
    },
    {
      name: "Agents & LLMs",
      href: `${insightSlug}/agents-and-llms`,
      icon: <BrainIcon />,
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
      icon: <WebhookIcon />,
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
      icon: <BracesIcon />,
    },
    {
      name: "Troubleshoot",
      href: `${insightSlug}/troubleshoot`,
      icon: <WrenchIcon />,
    },
    {
      name: "FAQs",
      href: `${insightSlug}/faqs`,
      icon: <MessageCircleQuestionIcon />,
    },
  ],
};
