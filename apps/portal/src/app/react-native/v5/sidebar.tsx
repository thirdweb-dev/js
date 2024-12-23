import { BookIcon, BugIcon, CodeIcon, ZapIcon } from "lucide-react";
import type { SideBar } from "../../../components/Layouts/DocLayout";
import { ReactIcon, TypeScriptIcon } from "../../../icons";

const slug = "/react-native/v5";

export const sidebar: SideBar = {
  name: "Connect React Native SDK",
  links: [
    {
      separator: true,
    },
    {
      name: "Overview",
      href: slug,
    },
    {
      name: "Getting Started",
      href: `${slug}/getting-started`,
      icon: <ZapIcon />,
    },
    {
      name: "Troubleshooting",
      href: `${slug}/troubleshooting`,
      icon: <BugIcon />,
    },
    {
      name: "Differences from React",
      href: `${slug}/differences`,
      icon: <BookIcon />,
    },
    {
      name: "TypeScript docs",
      href: "/typescript/v5",
      icon: <TypeScriptIcon />,
    },
    {
      name: "React docs",
      href: "/react/v5",
      icon: <ReactIcon />,
    },
    {
      name: "API Reference",
      href: "/references/typescript/v5",
      icon: <CodeIcon />,
    },
  ],
};
