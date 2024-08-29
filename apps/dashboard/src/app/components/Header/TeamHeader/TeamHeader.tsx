"use client";

import type { Project } from "@/api/projects";
import type { Team } from "@/api/team";
import { useCallback } from "react";
import { useDashboardRouter } from "../../../../@/lib/DashboardRouter";
import { CustomConnectWallet } from "../../../../@3rdweb-sdk/react/components/connect-wallet";
import { useAccount } from "../../../../@3rdweb-sdk/react/hooks/useApi";
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
  const myAccountQuery = useAccount();
  const router = useDashboardRouter();

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

  const headerProps: TeamHeaderCompProps = {
    currentProject: props.currentProject,
    currentTeam: props.currentTeam,
    teamsAndProjects: props.teamsAndProjects,
    email: myAccountQuery.data?.email,
    logout: logout,
    connectButton: <CustomConnectWallet />,
  };

  return (
    <div>
      <TeamHeaderDesktopUI {...headerProps} className="max-lg:hidden" />
      <TeamHeaderMobileUI {...headerProps} className="lg:hidden" />
    </div>
  );
}
