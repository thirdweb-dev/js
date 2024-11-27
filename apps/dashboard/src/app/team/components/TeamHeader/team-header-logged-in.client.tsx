"use client";

import type { Project } from "@/api/projects";
import type { Team } from "@/api/team";
import { getThirdwebClient } from "@/constants/thirdweb.server";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { CustomConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import { useAccount } from "@3rdweb-sdk/react/hooks/useApi";
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
}) {
  const [isCreateProjectDialogOpen, setIsCreateProjectDialogOpen] =
    useState(false);
  const myAccountQuery = useAccount();
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
    account: myAccountQuery.data,
    logout: logout,
    connectButton: <CustomConnectWallet />,
    createProject: () => setIsCreateProjectDialogOpen(true),
    client: getThirdwebClient(),
  };

  return (
    <div>
      <TeamHeaderDesktopUI {...headerProps} className="max-lg:hidden" />
      <TeamHeaderMobileUI {...headerProps} className="lg:hidden" />

      <LazyCreateAPIKeyDialog
        open={isCreateProjectDialogOpen}
        onOpenChange={setIsCreateProjectDialogOpen}
        onCreateAndComplete={() => {
          // refresh projects
          router.refresh();
        }}
      />
    </div>
  );
}
