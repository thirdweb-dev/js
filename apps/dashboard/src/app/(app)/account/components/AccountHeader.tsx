"use client";

import { createTeam } from "@/actions/createTeam";
import * as analytics from "@/analytics/dashboard.client";
import { AccountIdentifier } from "@/analytics/dashboard.client";
import type { Project } from "@/api/projects";
import type { Team } from "@/api/team";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { CustomConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { LazyCreateProjectDialog } from "components/settings/ApiKeys/Create/LazyCreateAPIKeyDialog";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { ThirdwebClient } from "thirdweb";
import { useActiveWallet, useDisconnect } from "thirdweb/react";
import { doLogout } from "../../login/auth-actions";
import {
  type AccountHeaderCompProps,
  AccountHeaderDesktopUI,
  AccountHeaderMobileUI,
} from "./AccountHeaderUI";

export function AccountHeader(props: {
  teamsAndProjects: Array<{ team: Team; projects: Project[] }>;
  account: Account;
  client: ThirdwebClient;
  accountAddress: string;
}) {
  const router = useDashboardRouter();
  const [createProjectDialogState, setCreateProjectDialogState] = useState<
    { team: Team; isOpen: true } | { isOpen: false }
  >({ isOpen: false });

  const wallet = useActiveWallet();
  const { disconnect } = useDisconnect();

  const logout = useCallback(async () => {
    try {
      await doLogout();
      analytics.reset();
      if (wallet) {
        disconnect(wallet);
      }
      router.refresh();
    } catch (e) {
      console.error("Failed to log out", e);
    }
  }, [router, disconnect, wallet]);

  const headerProps: AccountHeaderCompProps = {
    teamsAndProjects: props.teamsAndProjects,
    logout: logout,
    connectButton: (
      <CustomConnectWallet isLoggedIn={true} client={props.client} />
    ),
    createProject: (team: Team) =>
      setCreateProjectDialogState({
        team,
        isOpen: true,
      }),
    createTeam: () => {
      toast.promise(
        createTeam().then((res) => {
          if (res.status === "error") {
            throw new Error(res.errorMessage);
          }
          router.push(`/team/${res.data.slug}`);
        }),
        {
          loading: "Creating team",
          success: "Team created",
          error: "Failed to create team",
        },
      );
    },
    account: props.account,
    client: props.client,
    accountAddress: props.accountAddress,
  };

  return (
    <div>
      <AccountIdentifier account={props.account} />
      <AccountHeaderDesktopUI {...headerProps} className="max-lg:hidden" />
      <AccountHeaderMobileUI {...headerProps} className="lg:hidden" />

      {createProjectDialogState.isOpen && (
        <LazyCreateProjectDialog
          open={true}
          onOpenChange={() =>
            setCreateProjectDialogState({
              isOpen: false,
            })
          }
          onCreateAndComplete={() => {
            // refresh projects
            router.refresh();
          }}
          teamId={createProjectDialogState.team.id}
          teamSlug={createProjectDialogState.team.slug}
          enableNebulaServiceByDefault={
            createProjectDialogState.isOpen &&
            createProjectDialogState.team.enabledScopes.includes("nebula")
          }
        />
      )}
    </div>
  );
}
