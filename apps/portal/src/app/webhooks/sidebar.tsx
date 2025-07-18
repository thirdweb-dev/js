import { WebhookIcon } from "lucide-react";
import type { SideBar } from "@/components/Layouts/DocLayout";

export const sidebar: SideBar = {
  links: [
    {
      href: "/webhooks",
      icon: <WebhookIcon />,
      name: "Overview",
    },
  ],
  name: "Webhooks",
};
