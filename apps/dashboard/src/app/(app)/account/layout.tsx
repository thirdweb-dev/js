import type React from "react";
import type { ThirdwebClient } from "thirdweb";
import { getProjects } from "@/api/projects";
import { getTeams, type Team } from "@/api/team";
import { AppFooter } from "@/components/footers/app-footer";
import { AnnouncementBanner } from "@/components/misc/AnnouncementBanner";
import { TabPathLinks } from "@/components/ui/tabs";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import type { Account } from "@/hooks/useApi";
import {
  getAuthToken,
  getAuthTokenWalletAddress,
} from "../../../@/api/auth-token";
import { TWAutoConnect } from "../components/autoconnect";
import { loginRedirect } from "../login/loginRedirect";
import { AccountHeader } from "./components/AccountHeader";
import { getValidAccount } from "./settings/getAccount";

export default async function AccountLayout(props: {
  children: React.ReactNode;
}) {
  const [teams, account, accountAddress, authToken] = await Promise.all([
    getTeams(),
    getValidAccount("/account"),
    getAuthTokenWalletAddress(),
    getAuthToken(),
  ]);

  if (!teams || !accountAddress || !authToken) {
    loginRedirect("/account");
  }

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: undefined,
  });

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <div className="flex grow flex-col">
        <HeaderAndNav
          accountAddress={accountAddress}
          client={client}
          teams={teams}
          twAccount={account}
        />
        {props.children}
      </div>
      <TWAutoConnect client={client} />
      <AppFooter />
    </div>
  );
}

async function HeaderAndNav(props: {
  teams: Team[];
  twAccount: Account;
  accountAddress: string;
  client: ThirdwebClient;
}) {
  const teamsAndProjects = await Promise.all(
    props.teams.map(async (team) => ({
      projects: await getProjects(team.slug),
      team,
    })),
  );

  return (
    <div className="bg-card">
      <AnnouncementBanner />
      <AccountHeader
        account={props.twAccount}
        accountAddress={props.accountAddress}
        client={props.client}
        teamsAndProjects={teamsAndProjects}
      />
      <TabPathLinks
        links={[
          {
            exactMatch: true,
            name: "Overview",
            path: "/account",
          },
          {
            name: "Settings",
            path: "/account/settings",
          },
          {
            name: "Linked Wallets",
            path: "/account/wallets",
          },
          {
            name: "Devices",
            path: "/account/devices",
          },
        ]}
        tabContainerClassName="px-4 lg:px-6"
      />
    </div>
  );
}
