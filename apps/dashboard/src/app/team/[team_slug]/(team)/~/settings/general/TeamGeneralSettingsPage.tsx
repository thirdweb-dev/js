"use client";

import type { Team } from "@/api/team";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import { getThirdwebClient } from "@/constants/thirdweb.server";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { upload } from "thirdweb/storage";
import { TeamGeneralSettingsPageUI } from "./TeamGeneralSettingsPageUI";
import { updateTeam } from "./updateTeam";

export function TeamGeneralSettingsPage(props: {
  team: Team;
  authToken: string;
}) {
  const router = useDashboardRouter();
  const client = useThirdwebClient();

  return (
    <TeamGeneralSettingsPageUI
      team={props.team}
      client={client}
      updateTeamField={async (teamValue) => {
        await updateTeam({
          teamId: props.team.id,
          value: teamValue,
        });

        // Current page's slug is updated
        if (teamValue.slug) {
          router.replace(`/team/${teamValue.slug}/~/settings`);
        } else {
          router.refresh();
        }
      }}
      updateTeamImage={async (file) => {
        let uri: string | undefined = undefined;

        if (file) {
          // upload to IPFS
          uri = await upload({
            client: getThirdwebClient(props.authToken),
            files: [file],
          });
        }

        await updateTeam({
          teamId: props.team.id,
          value: {
            image: uri,
          },
        });

        router.refresh();
      }}
    />
  );
}
