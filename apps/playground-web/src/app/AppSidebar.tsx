"use client";
import { BookTextIcon, GithubIcon } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { FullWidthSidebarLayout } from "../components/blocks/full-width-sidebar-layout";
import { DashboardIcon } from "../icons/DashboardIcon";
import { sidebarLinks } from "./navLinks";

export function AppSidebarLayout(props: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <FullWidthSidebarLayout
        contentSidebarLinks={sidebarLinks}
        footerSidebarLinks={[
          {
            separator: true,
          },
          {
            href: "https://thirdweb.com/team?utm_source=playground",
            label: "Dashboard",
            icon: DashboardIcon,
          },
          {
            href: "https://portal.thirdweb.com?utm_source=playground",
            label: "Documentation",
            icon: BookTextIcon,
          },
          {
            href: "https://github.com/thirdweb-dev",
            label: "Github",
            icon: GithubIcon,
          },
        ]}
      >
        {props.children}
      </FullWidthSidebarLayout>
    </SidebarProvider>
  );
}
