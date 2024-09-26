"use client";

import type { Team } from "@/api/team";
import type { ThirdwebClient } from "thirdweb";
import { upload } from "thirdweb/storage";
import { TeamGeneralSettingsPageUI } from "./TeamGeneralSettingsPageUI";

export function TeamGeneralSettingsPage(props: {
  team: Team;
  client: ThirdwebClient;
}) {
  return (
    <TeamGeneralSettingsPageUI
      team={props.team}
      updateTeamImage={async (file) => {
        if (file) {
          // upload to IPFS
          const uri = await upload({
            client: props.client,
            files: [file],
          });

          // TODO - Implement updating the account image with uri
          console.log(uri);
        } else {
          // TODO - Implement deleting the account image
        }

        throw new Error("Not implemented");
      }}
    />
  );
}
