"use client";

import type { Project } from "@/api/projects";
import type { Team } from "@/api/team";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { CustomConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import { useAccount } from "@3rdweb-sdk/react/hooks/useApi";
import { useCallback, useState } from "react";
import { useActiveWallet, useDisconnect } from "thirdweb/react";
import { LazyCreateAPIKeyDialog } from "../../../../components/settings/ApiKeys/Create/LazyCreateAPIKeyDialog";
import {
  type TeamHeaderCompProps,
  TeamHeaderDesktopUI,
  TeamHeaderMobileUI,
} from "./TeamHeaderUI";

export function TeamHeader(props: {
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
    if (activeWallet) {
      disconnect(activeWallet);
    }
    // log out the user
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      router.push("/login");
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
  };

  return (
    <div>
      <TeamHeaderDesktopUI {...headerProps} className="max-lg:hidden" />
      <TeamHeaderMobileUI {...headerProps} className="lg:hidden" />

      <LazyCreateAPIKeyDialog
        open={isCreateProjectDialogOpen}
        onOpenChange={setIsCreateProjectDialogOpen}
        wording="project"
        onCreateAndComplete={() => {
          // refresh projects
          router.refresh();
        }}
      />
    </div>
  );
}
