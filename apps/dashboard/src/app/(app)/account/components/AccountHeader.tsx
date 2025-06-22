"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { ThirdwebClient } from "thirdweb";
import { useActiveWallet, useDisconnect } from "thirdweb/react";
import { createTeam } from "@/actions/createTeam";
import { resetAnalytics } from "@/analytics/reset";
import type { Project } from "@/api/projects";
import type { Team } from "@/api/team";
import { CustomConnectWallet } from "@/components/connect-wallet";
import { LazyCreateProjectDialog } from "@/components/project/create-project-modal/LazyCreateAPIKeyDialog";
import type { Account } from "@/hooks/useApi";
import { useDashboardRouter } from "@/lib/DashboardRouter";
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
      resetAnalytics();
      if (wallet) {
        disconnect(wallet);
      }
      router.refresh();
    } catch (e) {
      console.error("Failed to log out", e);
    }
  }, [router, disconnect, wallet]);

  const headerProps: AccountHeaderCompProps = {
    account: props.account,
    accountAddress: props.accountAddress,
    client: props.client,
    connectButton: (
      <CustomConnectWallet client={props.client} isLoggedIn={true} />
    ),
    createProject: (team: Team) =>
      setCreateProjectDialogState({
        isOpen: true,
        team,
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
          error: "Failed to create team",
          loading: "Creating team",
          success: "Team created",
        },
      );
    },
    logout: logout,
    teamsAndProjects: props.teamsAndProjects,
  };

  return (
    <div>
      <AccountHeaderDesktopUI {...headerProps} className="max-lg:hidden" />
      <AccountHeaderMobileUI {...headerProps} className="lg:hidden" />

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
