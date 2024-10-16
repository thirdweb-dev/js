import { getProjects } from "@/api/projects";
import { getTeams } from "@/api/team";
import { DashboardTypeCookieSetter } from "@/components/DashboardTypeCookieSetter";
import { SidebarLayout } from "@/components/blocks/SidebarLayout";
import { AppFooter } from "@/components/blocks/app-footer";
import type React from "react";
import { TWAutoConnect } from "../components/autoconnect";
import { AccountHeader } from "./components/AccountHeader";

export default async function AccountLayout(props: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex grow flex-col">
        <HeaderAndNav />
        <div className="border-border border-b py-10">
          <div className="mx-auto max-w-[1100px] px-6">
            <h1 className="font-semibold text-3xl tracking-tight">
              My Account
            </h1>
          </div>
        </div>
        <SidebarLayout
          className="max-w-[1100px]"
          sidebarLinks={[
            {
              href: "/account",
              label: "Overview",
              exactMatch: true,
            },
            {
              href: "/account/wallets",
              label: "Wallets",
            },
            {
              href: "/account/settings",
              label: "Settings",
            },
          ]}
        >
          {props.children}
        </SidebarLayout>
      </div>
      <TWAutoConnect />
      <DashboardTypeCookieSetter type="team" />
      <AppFooter />
    </div>
  );
}

async function HeaderAndNav() {
  const teams = await getTeams();

  const teamsAndProjects = await Promise.all(
    teams.map(async (team) => ({
      team,
      projects: await getProjects(team.slug),
    })),
  );

  return (
    <div className="border-b bg-muted/50">
      <AccountHeader teamsAndProjects={teamsAndProjects} />
    </div>
  );
}
