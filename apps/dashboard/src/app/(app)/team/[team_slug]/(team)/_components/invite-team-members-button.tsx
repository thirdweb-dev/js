"use client";

import { Button } from "@/components/ui/button";
import { UserPlusIcon } from "lucide-react";
import Link from "next/link";

export function InviteTeamMembersButton(props: { teamSlug: string }) {
  return (
    <Button asChild variant="outline" className="gap-2">
      <Link href={`/team/${props.teamSlug}/~/settings/members`}>
        <UserPlusIcon className="size-4" />
        <span>Invite Team Members</span>
      </Link>
    </Button>
  );
}
