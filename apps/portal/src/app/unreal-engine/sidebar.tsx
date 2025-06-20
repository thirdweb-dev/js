import { ZapIcon } from "lucide-react";
import { blueprints } from "@/app/unreal-engine/blueprints/sidebar";
import { cpp } from "@/app/unreal-engine/cpp/sidebar";
import { hrefBuilder } from "@/app/unreal-engine/util";
import type { SideBar } from "@/components/Layouts/DocLayout";

export const sidebar: SideBar = hrefBuilder("/unreal-engine", {
  links: [
    { separator: true },
    {
      href: "",
      name: "Overview",
    },
    {
      href: "/getting-started",
      icon: <ZapIcon />,
      name: "Getting Started",
    },
    blueprints,
    cpp,
  ],
  name: "Unreal Engine SDK",
});
