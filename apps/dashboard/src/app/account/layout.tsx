import { getProjects } from "@/api/projects";
import { getTeams } from "@/api/team";
import { AppFooter } from "@/components/blocks/app-footer";
import type React from "react";
import { TabPathLinks } from "../../@/components/ui/tabs";
import { TWAutoConnect } from "../components/autoconnect";
import { AccountHeader } from "./components/AccountHeader";

export default async function AccountLayout(props: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex grow flex-col">
        <HeaderAndNav />
        {props.children}
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
            path: "/account/contracts",
            name: "Contracts",
            exactMatch: true,
          },
          {
            path: "/account/settings",
            name: "Settings",
          },
          // TODO - enable these links after they are functional
          // {
          //   path: "/account/wallets",
          //   name: "Wallets",
          // },
          {
            path: "/account/devices",
            name: "Devices",
          },
        ]}
      />
    </div>
  );
}
