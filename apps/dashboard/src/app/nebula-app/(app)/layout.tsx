import { type Team, getTeams } from "@/api/team";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import Link from "next/link";
import type React from "react";
import { getValidAccount } from "../../account/settings/getAccount";
import {
  getAuthToken,
  getAuthTokenWalletAddress,
} from "../../api/lib/getAuthToken";
import { loginRedirect } from "../../login/loginRedirect";
import { NebulaWaitListPage } from "../../team/[team_slug]/[project_slug]/nebula/components/nebula-waitlist-page";
import { getSessions } from "./api/session";
import { ChatPageLayout } from "./components/ChatPageLayout";
import { NebulaAccountButton } from "./components/NebulaAccountButton";
import { NebulaIcon } from "./icons/NebulaIcon";

export default async function Layout(props: {
  children: React.ReactNode;
}) {
  const account = await getValidAccount();
  const authToken = await getAuthToken();

  if (!authToken) {
    loginRedirect();
  }

  const accountAddress = await getAuthTokenWalletAddress();

  if (!accountAddress) {
    loginRedirect();
  }

  const teams = await getTeams();
  const firstTeam = teams?.[0];

  if (!firstTeam) {
    loginRedirect();
  }

  const teamWithNebulaAccess = teams.find((team) =>
    team.enabledScopes.includes("nebula"),
  );

  // if none of them teams have nebula access, request access on first team, and show waitlist page
  if (!teamWithNebulaAccess) {
    return <NebulaWaitlistPage account={account} team={firstTeam} />;
  }

  const sessions = await getSessions({
    authToken,
  }).catch(() => []);

  return (
    <ChatPageLayout
      accountAddress={accountAddress}
      authToken={authToken}
      sessions={sessions}
      account={account}
    >
      {props.children}
    </ChatPageLayout>
  );
}

function NebulaWaitlistPage(props: {
  account: Account;
  team: Team;
}) {
  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      <header className="border-b">
        <div className="container flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2 font-medium text-xl tracking-tight">
            <NebulaIcon className="size-8 text-foreground" />
            Nebula
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="https://thirdweb.com/support"
              className="text-muted-foreground text-sm hover:text-foreground"
              target="_blank"
            >
              Support
            </Link>

            <Link
              href="https://portal.thirdweb.com/"
              className="text-muted-foreground text-sm hover:text-foreground"
              target="_blank"
            >
              Docs
            </Link>

            <NebulaAccountButton account={props.account} type="compact" />
          </div>
        </div>
      </header>

      {/* page */}
      <NebulaWaitListPage team={props.team} hideHeader />
    </div>
  );
}
