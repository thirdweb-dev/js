"use client";

import { CustomConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { LazyCreateProjectDialog } from "components/settings/ApiKeys/Create/LazyCreateAPIKeyDialog";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { ThirdwebClient } from "thirdweb";
import { useActiveWallet, useDisconnect } from "thirdweb/react";
import { createTeam } from "@/actions/createTeam";
import { useIdentifyAccount } from "@/analytics/hooks/identify-account";
import { useIdentifyTeam } from "@/analytics/hooks/identify-team";
import { resetAnalytics } from "@/analytics/reset";
import type { Project } from "@/api/projects";
import type { Team } from "@/api/team";
import { useDashboardRouter } from "@/lib/DashboardRouter";
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
  accountAddress: string;
  client: ThirdwebClient;
}) {
  // identify the account
  useIdentifyAccount({
    accountId: props.account.id,
    email: props.account.email,
  });

  // identify the team
  useIdentifyTeam({
    teamId: props.currentTeam.id,
  });
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
      resetAnalytics();
      if (activeWallet) {
        disconnect(activeWallet);
      }
      router.refresh();
    } catch (e) {
      console.error("Failed to log out", e);
    }
  }, [router, activeWallet, disconnect]);

  const headerProps: TeamHeaderCompProps = {
    account: props.account,
    accountAddress: props.accountAddress,
    client: props.client,
    connectButton: (
      <CustomConnectWallet client={props.client} isLoggedIn={true} />
    ),
    createProject: (team: Team) => {
      setCreateProjectDialogState({
        isOpen: true,
        team,
      });
    },
    createTeam: () => {
      toast.promise(
        createTeam().then((res) => {
          if (res.status === "error") {
            throw new Error(res.errorMessage);
          }
          router.push(`/team/${res.data.slug}`);
        }),
        {
          error: "Failed to create team",
          loading: "Creating team",
          success: "Team created",
        },
      );
    },
    currentProject: props.currentProject,
    currentTeam: props.currentTeam,
    logout: logout,
    teamsAndProjects: props.teamsAndProjects,
  };

  return (
    <div>
      <TeamHeaderDesktopUI {...headerProps} className="max-lg:hidden" />
      <TeamHeaderMobileUI {...headerProps} className="lg:hidden" />

      {createProjectDialogState.isOpen && (
        <LazyCreateProjectDialog
          enableNebulaServiceByDefault={
            createProjectDialogState.isOpen &&
            createProjectDialogState.team.enabledScopes.includes("nebula")
          }
          onCreateAndComplete={() => {
            // refresh projects
            router.refresh();
          }}
          onOpenChange={() =>
            setCreateProjectDialogState({
              isOpen: false,
            })
          }
          open={true}
          teamId={createProjectDialogState.team.id}
          teamSlug={createProjectDialogState.team.slug}
        />
      )}
    </div>
  );
}
