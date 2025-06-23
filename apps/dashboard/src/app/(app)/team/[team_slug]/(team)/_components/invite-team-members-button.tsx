"use client";

import { UserPlusIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function InviteTeamMembersButton(props: { teamSlug: string }) {
  return (
    <Button asChild className="gap-2 rounded-full bg-card" variant="outline">
      <Link href={`/team/${props.teamSlug}/~/settings/members`}>
        <UserPlusIcon className="size-4" />
        <span>Invite Team Members</span>
      </Link>
    </Button>
  );
}
