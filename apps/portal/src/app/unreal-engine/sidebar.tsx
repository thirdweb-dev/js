import { blueprints } from "@/app/unreal-engine/blueprints/sidebar";
import { cpp } from "@/app/unreal-engine/cpp/sidebar";
import { hrefBuilder } from "@/app/unreal-engine/util";
import type { SideBar } from "@/components/Layouts/DocLayout";
import { ZapIcon } from "lucide-react";

export const sidebar: SideBar = hrefBuilder("/unreal-engine", {
  name: "Unreal Engine SDK",
  links: [
    { separator: true },
    {
      name: "Overview",
      href: "",
    },
    {
      name: "Getting Started",
      href: "/getting-started",
      icon: <ZapIcon />,
    },
    blueprints,
    cpp,
  ],
});
