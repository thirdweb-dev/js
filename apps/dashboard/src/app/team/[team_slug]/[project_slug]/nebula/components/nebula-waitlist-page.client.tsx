"use client";

import { joinTeamWaitlist } from "@/actions/joinWaitlist";
import { JoinNebulaWaitlistPageUI } from "./nebula-waitlist-page-ui.client";

export function JoinNebulaWaitlistPage(props: {
  onWaitlist: boolean;
  teamSlug: string;
}) {
  return (
    <JoinNebulaWaitlistPageUI
      onWaitlist={props.onWaitlist}
      joinWaitList={async () => {
        await joinTeamWaitlist({
          scope: "nebula",
          teamSlug: props.teamSlug,
        });
      }}
    />
  );
}
