"use client";

import { sendTeamInvite } from "@/actions/sendTeamInvite";
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
import { ExternalLinkIcon, UserPlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { getValidTeamPlan } from "../../../../../../components/TeamHeader/getValidTeamPlan";

export function InviteSection(props: {
  team: Team;
  userHasEditPermission: boolean;
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<TeamAccountRole>("MEMBER");
  const teamPlan = getValidTeamPlan(props.team);
  let bottomSection: React.ReactNode = null;
  const inviteEnabled = teamPlan !== "free" && props.userHasEditPermission;

  if (teamPlan === "free") {
    bottomSection = (
      <div className="lg:px6 flex items-center justify-between gap-4 border-border border-t px-4 py-4">
        <p className="text-muted-foreground text-sm">
          This feature is not available on the Free Plan.{" "}
          <Link
            href="https://thirdweb.com/pricing"
            target="_blank"
            className="text-link-foreground hover:text-foreground"
          >
            View plans <ExternalLinkIcon className="inline size-3" />
          </Link>
        </p>

        <Button variant="outline" size="sm" asChild>
          <Link
            href={`/team/${props.team.slug}/~/settings/billing`}
            className="gap-2"
          >
            Upgrade
          </Link>
        </Button>
      </div>
    );
  } else if (!props.userHasEditPermission) {
    bottomSection = (
      <div className="flex min-h-[60px] items-center justify-between border-border border-t px-4 py-4 lg:px-6">
        <p className="text-muted-foreground text-sm">
          You don't have permission to invite members
        </p>
      </div>
    );
  } else {
    bottomSection = (
      <div className="flex items-center border-border border-t px-4 py-4 lg:justify-end lg:px-6">
        <Button
          variant="outline"
          size="sm"
          className="gap-2 max-sm:w-full"
          disabled={!inviteEnabled}
          onClick={() => {
            toast.promise(
              sendTeamInvite.bind(null, {
                teamId: props.team.id,
                email,
                role,
              }),
              {
                loading: "Sending invite...",
                success: "Invite sent",
                error: "Failed to send invite",
              },
            );
          }}
        >
          <UserPlus className="size-3" />
          Invite
        </Button>
      </div>
    );
  }

  return (
    <section>
      <h2 className="mb-3 font-semibold text-2xl tracking-tight">Invite</h2>

      {/* Card */}
      <div className="rounded-lg border border-border bg-card">
        {/* Invite via Link */}
        <div
          className={cn(
            "px-4 py-4 lg:px-6",
            !inviteEnabled && "cursor-not-allowed",
          )}
        >
          <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
            <p className="text-foreground text-sm">Invite new members</p>

            {/* <Button
              size="sm"
              variant="outline"
              className="gap-2 max-sm:bg-card"
              disabled={!inviteEnabled}
            >
              <LinkIcon className="size-3" />
              Copy Link
            </Button> */}
          </div>
        </div>

        <div className="mt-2 px-4 lg:my-0 lg:px-6">
          <Separator />
        </div>

        {/* Invite via Email Send */}
        <div className="px-4 py-6 lg:px-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label
                htmlFor="email"
                className={cn(
                  "mb-1 block text-sm",
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
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>

            <div>
              <Label
                htmlFor="role"
                className={cn(
                  "mb-1 block text-sm",
                  !inviteEnabled && "text-muted-foreground",
                )}
              >
                Role
              </Label>
              <RoleSelector
                disabled={!inviteEnabled}
                value={role}
                onChange={(v) => {
                  setRole(v as TeamAccountRole);
                }}
              />
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
  value: TeamAccountRole;
  onChange: (v: TeamAccountRole) => void;
}) {
  const roles: TeamAccountRole[] = ["OWNER", "MEMBER"];

  return (
    <Select
      value={props.value}
      onValueChange={(v) => {
        props.onChange(v as TeamAccountRole);
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
