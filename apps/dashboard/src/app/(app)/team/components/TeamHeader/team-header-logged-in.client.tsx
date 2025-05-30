"use client";

import type { Project } from "@/api/projects";
import type { Team } from "@/api/team";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { CustomConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { LazyCreateProjectDialog } from "components/settings/ApiKeys/Create/LazyCreateAPIKeyDialog";
import { useCallback, useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import { useActiveWallet, useDisconnect } from "thirdweb/react";
import { doLogout } from "../../../login/auth-actions";
import {
  getInboxNotifications,
  markNotificationAsRead,
} from "../NotificationButton/fetch-notifications";
import {
  type TeamHeaderCompProps,
  TeamHeaderDesktopUI,
  TeamHeaderMobileUI,
} from "./TeamHeaderUI";

export function TeamHeaderLoggedIn(props: {
  currentTeam: Team;
  teamsAndProjects: Array<{ team: Team; projects: Project[] }>;
  currentProject: Project | undefined;
  account: Pick<Account, "email" | "id">;
  accountAddress: string;
  client: ThirdwebClient;
}) {
  const [createProjectDialogState, setCreateProjectDialogState] = useState<
    { team: Team; isOpen: true } | { isOpen: false }
  >({ isOpen: false });
  const activeWallet = useActiveWallet();
  const { disconnect } = useDisconnect();
  const router = useDashboardRouter();

  const logout = useCallback(async () => {
    // log out the user
    try {
      await doLogout();
      if (activeWallet) {
        disconnect(activeWallet);
      }
      router.refresh();
    } catch (e) {
      console.error("Failed to log out", e);
    }
  }, [router, activeWallet, disconnect]);

  const headerProps: TeamHeaderCompProps = {
    currentProject: props.currentProject,
    currentTeam: props.currentTeam,
    teamsAndProjects: props.teamsAndProjects,
    account: props.account,
    logout: logout,
    connectButton: (
      <CustomConnectWallet isLoggedIn={true} client={props.client} />
    ),
    createProject: (team: Team) => {
      setCreateProjectDialogState({
        isOpen: true,
        team,
      });
    },
    client: props.client,
    accountAddress: props.accountAddress,
    getInboxNotifications: getInboxNotifications,
    markNotificationAsRead: markNotificationAsRead,
  };

  return (
    <div>
      <TeamHeaderDesktopUI {...headerProps} className="max-lg:hidden" />
      <TeamHeaderMobileUI {...headerProps} className="lg:hidden" />

      {createProjectDialogState.isOpen && (
        <LazyCreateProjectDialog
          open={true}
          teamSlug={createProjectDialogState.team.slug}
          teamId={createProjectDialogState.team.id}
          onOpenChange={() =>
            setCreateProjectDialogState({
              isOpen: false,
            })
          }
          onCreateAndComplete={() => {
            // refresh projects
            router.refresh();
          }}
          enableNebulaServiceByDefault={
            createProjectDialogState.isOpen &&
            createProjectDialogState.team.enabledScopes.includes("nebula")
          }
        />
      )}
    </div>
  );
}
