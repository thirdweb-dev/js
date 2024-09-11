import { getProjects } from "@/api/projects";
import { getTeams } from "@/api/team";
import { AppFooter } from "@/components/blocks/app-footer";
import { TabPathLinks } from "@/components/ui/tabs";
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
        <main className="grow flex flex-col">{props.children}</main>
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
    <div className="bg-muted/50">
      <AccountHeader teamsAndProjects={teamsAndProjects} />

      <TabPathLinks
        tabContainerClassName="px-4 lg:px-6"
        links={[
          {
            path: "/account",
            name: "Overview",
            exactMatch: true,
          },
          {
            path: "/account/wallets",
            name: "Wallets",
          },
          {
            path: "/account/settings",
            name: "Settings",
          },
        ]}
      />
    </div>
  );
}
