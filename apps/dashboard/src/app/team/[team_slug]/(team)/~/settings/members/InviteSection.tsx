"use client";

import type { Team } from "@/api/team";
import type { TeamAccountRole } from "@/api/team-members";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ExternalLinkIcon, LinkIcon, UserPlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { getValidTeamPlan } from "../../../../../../components/Header/TeamHeader/getValidTeamPlan";

export function InviteSection(props: {
  team: Team;
  userHasEditPermission: boolean;
}) {
  const teamPlan = getValidTeamPlan(props.team);
  let bottomSection: React.ReactNode = null;
  const inviteEnabled = teamPlan === "pro" && props.userHasEditPermission;

  if (teamPlan !== "pro") {
    bottomSection = (
      <div className="px-4 lg:px6 py-4 flex items-center justify-between border-t gap-4">
        <p className="text-muted-foreground text-sm">
          This feature is only available on the{" "}
          <Link
            href="https://thirdweb.com/pricing"
            target="_blank"
            className="text-link-foreground hover:text-foreground"
          >
            Pro plan <ExternalLinkIcon className="size-3 inline" />
          </Link>
        </p>

        {/* TODO - link to billing settings page */}
        <Button variant="outline" size="sm">
          Upgrade
        </Button>
      </div>
    );
  } else if (!props.userHasEditPermission) {
    bottomSection = (
      <div className="px-4 lg:px-6 py-4 flex items-center justify-between border-t min-h-[60px]">
        <p className="text-muted-foreground text-sm">
          You don't have permission to invite members
        </p>
      </div>
    );
  } else {
    bottomSection = (
      <div className="py-4 px-4 lg:px-6 flex items-center lg:justify-end border-t ">
        <Button variant="outline" size="sm" className="gap-2 max-sm:w-full">
          <UserPlus className="size-3" />
          Invite
        </Button>
      </div>
    );
  }

  return (
    <section>
      <h2 className="text-2xl font-semibold tracking-tight mb-3">Invite</h2>

      {/* Card */}
      <div className="border rounded-lg bg-muted/50">
        {/* Invite via Link */}
        <div
          className={cn(
            "px-4 lg:px-6 py-4",
            !inviteEnabled && "cursor-not-allowed",
          )}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <p className="text-foreground text-sm">
              Invite new members via email or link
            </p>

            <Button
              size="sm"
              variant="outline"
              className="gap-2 max-sm:bg-muted/50"
              disabled={!inviteEnabled}
            >
              <LinkIcon className="size-3" />
              Copy Link
            </Button>
          </div>
        </div>

        <div className="px-4 mt-2 lg:my-0 lg:px-6">
          <Separator />
        </div>

        {/* Invite via Email Send */}
        <div className="px-4 lg:px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="email"
                className={cn(
                  "text-sm mb-1 block",
                  !inviteEnabled && "text-muted-foreground",
                )}
              >
                Email
              </Label>
              <Input
                type="email"
                id="email"
                placeholder="user@example.com"
                disabled={!inviteEnabled}
                className="disabled:bg-muted"
              />
            </div>

            <div>
              <Label
                htmlFor="role"
                className={cn(
                  "text-sm mb-1 block",
                  !inviteEnabled && "text-muted-foreground",
                )}
              >
                Role
              </Label>
              <RoleSelector disabled={!inviteEnabled} />
            </div>
          </div>
        </div>

        {bottomSection}
      </div>
    </section>
  );
}

function RoleSelector(props: {
  disabled?: boolean;
}) {
  const roles: TeamAccountRole[] = ["OWNER", "MEMBER"];
  const [role, setRole] = useState<TeamAccountRole>("MEMBER");

  return (
    <Select
      value={role}
      onValueChange={(v) => {
        setRole(v as TeamAccountRole);
      }}
    >
      <SelectTrigger
        className="capitalize disabled:bg-muted"
        disabled={props.disabled}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {roles.map((role) => (
          <SelectItem key={role} value={role} className="capitalize">
            {role.toLowerCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
