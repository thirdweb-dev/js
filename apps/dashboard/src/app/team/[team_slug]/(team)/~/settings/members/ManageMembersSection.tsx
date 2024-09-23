"use client";

import type { Team } from "@/api/team";
import type { TeamAccountRole, TeamMember } from "@/api/team-members";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EllipsisIcon, SearchIcon } from "lucide-react";
import { useState } from "react";

export function ManageMembersSection(props: {
  team: Team;
  userHasEditPermission: boolean;
  members: TeamMember[];
}) {
  let topSection: React.ReactNode = null;

  if (!props.userHasEditPermission) {
    topSection = (
      <div className="border-border border-b p-4">
        <p className="text-muted-foreground text-sm">
          You don't have permission to manage members
        </p>
      </div>
    );
  } else {
    topSection = (
      <div className="flex items-center justify-between border-border border-b p-4">
        <div className="flex items-center gap-3 lg:gap-4">
          <Checkbox
            id="select-all"
            className="border-muted-foreground data-[state=checked]:border-inverted"
            disabled={
              !props.userHasEditPermission || props.members.length === 0
            }
          />
          <Label
            htmlFor="select-all"
            className="cursor-pointer text-muted-foreground"
          >
            Select All ({props.members.length})
          </Label>
        </div>

        <Button
          size="icon"
          variant="ghost"
          className="!h-auto !w-auto p-1.5"
          disabled={!props.userHasEditPermission || props.members.length === 0}
        >
          <EllipsisIcon className="size-4 text-muted-foreground" />
        </Button>
      </div>
    );
  }

  return (
    <section>
      <h2 className="font-semibold text-2xl tracking-tight">Team Members</h2>

      <div className="h-3" />

      <FiltersSection disabled={props.members.length === 0} />

      <div className="h-4" />

      {/* Card */}
      <div className="rounded-lg border border-border bg-muted/50">
        {/* Top section */}
        {topSection}

        {props.members.length > 0 && (
          <ul>
            {props.members.map((member) => {
              return (
                <li key={member.accountId}>
                  <MemberRow
                    member={member}
                    userHasEditPermission={props.userHasEditPermission}
                  />
                </li>
              );
            })}
          </ul>
        )}

        {/* Empty state */}
        {props.members.length === 0 && (
          <div className="flex justify-center px-4 py-10">
            <p className="text-muted-foreground text-sm">No Members Found</p>
          </div>
        )}
      </div>
    </section>
  );
}

function MemberRow(props: {
  member: TeamMember;
  userHasEditPermission: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-border border-b px-4 py-4">
      <div className="flex items-center gap-3 lg:gap-4">
        {/* Checkbox */}
        <Checkbox
          id="select-all"
          className="border-muted-foreground data-[state=checked]:border-inverted"
          disabled={!props.userHasEditPermission}
        />

        {/* PFP */}
        <div className="size-8 rounded-full border border-border bg-muted lg:size-9" />

        <div>
          <p className="mb-0.5 font-semibold text-sm">
            {props.member.account.name}
          </p>
          <p className="text-muted-foreground text-sm opacity-70">
            {props.member.account.email}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
        <p className="text-muted-foreground text-xs capitalize lg:text-sm">
          {props.member.role.toLowerCase()}
        </p>

        <Button
          size="icon"
          variant="ghost"
          className="!h-auto !w-auto p-1.5"
          disabled={!props.userHasEditPermission}
        >
          <EllipsisIcon className="size-4 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}

function FiltersSection(props: {
  disabled: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
      {/* Search  */}
      <div className="relative grow">
        <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-3 size-4 transform text-muted-foreground" />
        <Input
          placeholder="Search Team members"
          className="bg-muted/50 pl-9"
          disabled={props.disabled}
        />
      </div>

      <div className="grid grid-cols-2 items-center gap-3 lg:flex">
        <RoleSelector disabled={props.disabled} />
        <SortMembersBy disabled={props.disabled} />
      </div>
    </div>
  );
}

type MemberSortId = "date" | "a-z" | "z-a";

function SortMembersBy(props: {
  disabled?: boolean;
}) {
  const [sortBy, setSortBy] = useState<MemberSortId>("date");
  const valueToLabel: Record<MemberSortId, string> = {
    date: "Date",
    "a-z": "Name (A-Z)",
    "z-a": "Name (Z-A)",
  };

  const sortByIds: MemberSortId[] = ["date", "a-z", "z-a"];

  return (
    <Select
      value={sortBy}
      onValueChange={(v) => {
        setSortBy(v as "date" | "a-z" | "z-a");
      }}
    >
      <SelectTrigger
        className="bg-muted/50 capitalize disabled:bg-muted lg:w-[150px]"
        disabled={props.disabled}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {sortByIds.map((id) => (
          <SelectItem key={id} value={id} className="capitalize">
            {valueToLabel[id]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function RoleSelector(props: {
  disabled?: boolean;
}) {
  const roles: (TeamAccountRole | "ALL ROLES")[] = [
    "OWNER",
    "MEMBER",
    "ALL ROLES",
  ];
  const [role, setRole] = useState<TeamAccountRole | "ALL ROLES">("ALL ROLES");

  return (
    <Select
      value={role}
      onValueChange={(v) => {
        setRole(v as TeamAccountRole);
      }}
    >
      <SelectTrigger
        className="bg-muted/50 capitalize disabled:bg-muted lg:w-[150px]"
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
