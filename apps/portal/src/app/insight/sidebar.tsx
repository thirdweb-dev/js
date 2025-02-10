import type { SideBar } from "@/components/Layouts/DocLayout";
import {
  Album,
  Box,
  Braces,
  Brain,
  MessageCircleQuestionIcon,
  Rocket,
  StickyNote,
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
