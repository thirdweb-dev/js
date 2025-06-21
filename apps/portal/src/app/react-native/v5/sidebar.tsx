import { BookIcon, BugIcon, CodeIcon, ZapIcon } from "lucide-react";
import type { SideBar } from "../../../components/Layouts/DocLayout";
import { ReactIcon, TypeScriptIcon } from "../../../icons";

const slug = "/react-native/v5";

export const sidebar: SideBar = {
  links: [
    {
      separator: true,
    },
    {
      href: slug,
      name: "Overview",
    },
    {
      href: `${slug}/getting-started`,
      icon: <ZapIcon />,
      name: "Getting Started",
    },
    {
      href: `${slug}/troubleshooting`,
      icon: <BugIcon />,
      name: "Troubleshooting",
    },
    {
      href: `${slug}/differences`,
      icon: <BookIcon />,
      name: "Differences from React",
    },
    {
      href: "/typescript/v5",
      icon: <TypeScriptIcon />,
      name: "TypeScript docs",
    },
    {
      href: "/react/v5",
      icon: <ReactIcon />,
      name: "React docs",
    },
    {
      href: "/references/typescript/v5",
      icon: <CodeIcon />,
      name: "API Reference",
    },
  ],
  name: "Connect React Native SDK",
};
