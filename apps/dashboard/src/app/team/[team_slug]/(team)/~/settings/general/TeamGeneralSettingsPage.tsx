"use client";

import { apiServerProxy } from "@/actions/proxies";
import type { Team } from "@/api/team";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import type { ThirdwebClient } from "thirdweb";
import { upload } from "thirdweb/storage";
import { TeamGeneralSettingsPageUI } from "./TeamGeneralSettingsPageUI";
import { updateTeam } from "./updateTeam";

export function TeamGeneralSettingsPage(props: {
  team: Team;
  client: ThirdwebClient;
  accountId: string;
}) {
  const router = useDashboardRouter();

  return (
    <TeamGeneralSettingsPageUI
      team={props.team}
      client={props.client}
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
      leaveTeam={async () => {
        const res = await apiServerProxy({
          pathname: `/v1/teams/${props.team.id}/members/${props.accountId}`,
          method: "DELETE",
        });

        if (!res.ok) {
          throw new Error(res.error);
        }

        router.replace("/team");
      }}
      updateTeamImage={async (file) => {
        let uri: string | undefined = undefined;

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
