"use client";

import type { ThirdwebClient } from "thirdweb";
import { upload } from "thirdweb/storage";
import { apiServerProxy } from "@/actions/proxies";
import type { Team } from "@/api/team";
import type { VerifiedDomainResponse } from "@/api/verified-domain";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { TeamGeneralSettingsPageUI } from "./TeamGeneralSettingsPageUI";
import { updateTeam } from "./updateTeam";

export function TeamGeneralSettingsPage(props: {
  team: Team;
  initialVerification: VerifiedDomainResponse | null;
  isOwnerAccount: boolean;
  client: ThirdwebClient;
  accountId: string;
}) {
  const router = useDashboardRouter();

  return (
    <TeamGeneralSettingsPageUI
      client={props.client}
      initialVerification={props.initialVerification}
      isOwnerAccount={props.isOwnerAccount}
      leaveTeam={async () => {
        const res = await apiServerProxy({
          method: "DELETE",
          pathname: `/v1/teams/${props.team.id}/members/${props.accountId}`,
        });

        if (!res.ok) {
          throw new Error(res.error);
        }

        router.replace("/team");
      }}
      team={props.team}
      updateTeamField={async (teamValue) => {
        const res = await updateTeam({
          teamId: props.team.id,
          value: teamValue,
        });

        if (!res.ok) {
          throw new Error(res.error);
        }

        // Current page's slug is updated
        if (teamValue.slug) {
          router.replace(`/team/${teamValue.slug}/~/settings`);
        } else {
          router.refresh();
        }
      }}
      updateTeamImage={async (file) => {
        let uri: string | undefined;

        if (file) {
          // upload to IPFS
          uri = await upload({
            client: props.client,
            files: [file],
          });
        }

        const res = await updateTeam({
          teamId: props.team.id,
          value: {
            image: uri,
          },
        });

        if (!res.ok) {
          throw new Error(res.error);
        }

        router.refresh();
      }}
    />
  );
}
