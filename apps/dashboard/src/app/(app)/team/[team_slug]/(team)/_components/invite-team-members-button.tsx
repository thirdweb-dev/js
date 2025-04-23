"use client";

import { Button } from "@/components/ui/button";
import { useTrack } from "hooks/analytics/useTrack";
import { UserPlusIcon } from "lucide-react";
import Link from "next/link";

export function InviteTeamMembersButton(props: { teamSlug: string }) {
  const trackEvent = useTrack();
  return (
    <Button
      asChild
      variant="outline"
      className="gap-2"
      onClick={() =>
        trackEvent({
          category: "inviteTeam",
          action: "click",
          label: "invite-team",
        })
      }
    >
      <Link href={`/team/${props.teamSlug}/~/settings/members`}>
        <UserPlusIcon className="size-4" />
        <span>Invite Team Members</span>
      </Link>
    </Button>
  );
}
