"use client";

import type { Project } from "@/api/projects";
import type { Team } from "@/api/team";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { CustomConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { useCallback, useState } from "react";
import { useActiveWallet, useDisconnect } from "thirdweb/react";
import { LazyCreateAPIKeyDialog } from "../../../components/settings/ApiKeys/Create/LazyCreateAPIKeyDialog";
import { doLogout } from "../../login/auth-actions";
import {
  type AccountHeaderCompProps,
  AccountHeaderDesktopUI,
  AccountHeaderMobileUI,
} from "./AccountHeaderUI";

export function AccountHeader(props: {
  teamsAndProjects: Array<{ team: Team; projects: Project[] }>;
  account: Account;
}) {
  const router = useDashboardRouter();
  const [createProjectDialogState, setCreateProjectDialogState] = useState<
    { team: Team; isOpen: true } | { isOpen: false }
  >({ isOpen: false });

  const client = useThirdwebClient();
  const wallet = useActiveWallet();
  const { disconnect } = useDisconnect();

  const logout = useCallback(async () => {
    try {
      await doLogout();
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
    connectButton: <CustomConnectWallet isLoggedIn={true} />,
    createProject: (team: Team) =>
      setCreateProjectDialogState({
        team,
        isOpen: true,
      }),
    account: props.account,
    client,
  };

  return (
    <div>
      <AccountHeaderDesktopUI {...headerProps} className="max-lg:hidden" />
      <AccountHeaderMobileUI {...headerProps} className="lg:hidden" />

      <LazyCreateAPIKeyDialog
        open={createProjectDialogState.isOpen}
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
