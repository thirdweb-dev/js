"use client";

import type { Project } from "@/api/projects";
import type { Team } from "@/api/team";
import { getThirdwebClient } from "@/constants/thirdweb.server";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { CustomConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { useCallback, useState } from "react";
import { useActiveWallet, useDisconnect } from "thirdweb/react";
import { LazyCreateAPIKeyDialog } from "../../../../components/settings/ApiKeys/Create/LazyCreateAPIKeyDialog";
import { doLogout } from "../../../login/auth-actions";
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
    connectButton: <CustomConnectWallet isLoggedIn={true} />,
    createProject: (team: Team) => {
      setCreateProjectDialogState({
        isOpen: true,
        team,
      });
    },
    client: getThirdwebClient(),
  };

  return (
    <div>
      <TeamHeaderDesktopUI {...headerProps} className="max-lg:hidden" />
      <TeamHeaderMobileUI {...headerProps} className="lg:hidden" />

      <LazyCreateAPIKeyDialog
        open={createProjectDialogState.isOpen}
        teamSlug={
          createProjectDialogState.isOpen
            ? createProjectDialogState.team.slug
            : undefined
        }
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
    </div>
  );
}
