"use client";

import type { Project } from "@/api/projects";
import type { Team } from "@/api/team";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { CustomConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import { useAccount } from "@3rdweb-sdk/react/hooks/useApi";
import { useCallback, useState } from "react";
import { LazyCreateAPIKeyDialog } from "../../../components/settings/ApiKeys/Create/LazyCreateAPIKeyDialog";
import {
  type AccountHeaderCompProps,
  AccountHeaderDesktopUI,
  AccountHeaderMobileUI,
} from "./AccountHeaderUI";

export function AccountHeader(props: {
  teamsAndProjects: Array<{ team: Team; projects: Project[] }>;
}) {
  const myAccountQuery = useAccount();
  const router = useDashboardRouter();
  const [isCreateProjectDialogOpen, setIsCreateProjectDialogOpen] =
    useState(false);

  const logout = useCallback(async () => {
    // log out the user
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      router.push("/login");
    } catch (e) {
      console.error("Failed to log out", e);
    }
  }, [router]);

  const headerProps: AccountHeaderCompProps = {
    teamsAndProjects: props.teamsAndProjects,
    logout: logout,
    connectButton: <CustomConnectWallet />,
    createProject: () => setIsCreateProjectDialogOpen(true),
    account: myAccountQuery.data,
  };

  return (
    <div>
      <AccountHeaderDesktopUI {...headerProps} className="max-lg:hidden" />
      <AccountHeaderMobileUI {...headerProps} className="lg:hidden" />

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
