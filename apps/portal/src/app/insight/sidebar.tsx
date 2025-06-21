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
import type { SideBar } from "@/components/Layouts/DocLayout";

const insightSlug = "/insight";

export const sidebar: SideBar = {
  links: [
    {
      href: "/insight",
      icon: <BoxIcon />,
      name: "Overview",
    },
    {
      href: `${insightSlug}/use-cases`,
      icon: <StickyNoteIcon />,
      name: "Use Cases",
    },
    {
      href: "https://playground.thirdweb.com/insight",
      icon: <ExternalLinkIcon />,
      name: "Playground",
    },
    {
      href: `${insightSlug}/get-started`,
      icon: <RocketIcon />,
      name: "Get Started",
    },
    {
      href: `${insightSlug}/blueprints`,
      icon: <AlbumIcon />,
      name: "Blueprints",
    },
    {
      href: `${insightSlug}/multichain-queries`,
      icon: <NetworkIcon />,
      name: "Multichain Queries",
    },
    {
      href: `${insightSlug}/agents-and-llms`,
      icon: <BrainIcon />,
      links: [
        {
          href: `${insightSlug}/agents-and-llms/llmstxt`,
          name: "llms.txt",
        },
      ],
      name: "Agents & LLMs",
    },
    {
      href: `${insightSlug}/webhooks`,
      icon: <WebhookIcon />,
      links: [
        {
          href: `${insightSlug}/webhooks`,
          name: "Get Started",
        },
        {
          href: `${insightSlug}/webhooks/managing-webhooks`,
          name: "Managing Webhooks",
        },
        {
          href: `${insightSlug}/webhooks/filtering`,
          name: "Filtering",
        },
        {
          href: `${insightSlug}/webhooks/payload`,
          name: "Payload",
        },
        {
          href: "https://insight.thirdweb.com/reference#tag/webhooks",
          name: "API Reference",
        },
      ],
      name: "Webhooks",
    },
    {
      href: "https://insight.thirdweb.com/reference",
      icon: <BracesIcon />,
      name: "API Reference",
    },
    {
      href: `${insightSlug}/troubleshoot`,
      icon: <WrenchIcon />,
      name: "Troubleshoot",
    },
    {
      href: `${insightSlug}/faqs`,
      icon: <MessageCircleQuestionIcon />,
      name: "FAQs",
    },
  ],
  name: "Insight",
};
