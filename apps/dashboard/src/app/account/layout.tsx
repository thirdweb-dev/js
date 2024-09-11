import { getProjects } from "@/api/projects";
import { getTeams } from "@/api/team";
import { SidebarLayout } from "@/components/blocks/SidebarLayout";
import { AppFooter } from "@/components/blocks/app-footer";
import type React from "react";
import { TWAutoConnect } from "../components/autoconnect";
import { AccountHeader } from "./components/AccountHeader";

export default async function AccountLayout(props: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full flex flex-col bg-background">
      <div className="grow flex flex-col">
        <HeaderAndNav />
        <SidebarLayout
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
    <div className="bg-muted/50 border-b">
      <AccountHeader teamsAndProjects={teamsAndProjects} />
    </div>
  );
}
