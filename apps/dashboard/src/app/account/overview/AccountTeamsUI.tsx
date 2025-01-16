"use client";

import type { Team } from "@/api/team";
import type { TeamAccountRole } from "@/api/team-members";
import { GradientAvatar } from "@/components/blocks/Avatars/GradientAvatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { EllipsisIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import { TeamPlanBadge } from "../../components/TeamPlanBadge";
import { getValidTeamPlan } from "../../team/components/TeamHeader/getValidTeamPlan";
import { SearchInput } from "../components/SearchInput";

export function AccountTeamsUI(props: {
  teamsWithRole: {
    team: Team;
    role: TeamAccountRole;
  }[];
  client: ThirdwebClient;
}) {
  const [teamSearchValue, setTeamSearchValue] = useState("");
  const teamsToShow = !teamSearchValue
    ? props.teamsWithRole
    : props.teamsWithRole.filter((v) => {
        return v.team.name
          .toLowerCase()
          .includes(teamSearchValue.toLowerCase());
      });

  return (
    <div>
      <div className="flex flex-col items-start gap-4 lg:flex-row lg:justify-between">
        <div>
          <h2 className="mb-0.5 font-semibold text-xl tracking-tight">Teams</h2>
          <p className="text-muted-foreground text-sm">
            The teams that are associated with your thirdweb account
          </p>
        </div>

        <ToolTipLabel label="Coming Soon">
          <Button variant="primary" disabled className="gap-2 max-sm:w-full">
            <PlusIcon className="size-4" />
            Create a Team
          </Button>
        </ToolTipLabel>
      </div>

      <div className="h-4" />

      <SearchInput
        placeholder="Search Teams"
        value={teamSearchValue}
        onValueChange={setTeamSearchValue}
      />

      <div className="h-4" />

      <ul className="rounded-lg border bg-card">
        {/* Teams List */}
        {teamsToShow.map((v) => {
          return (
            <li
              key={v.team.id}
              className="border-border border-b p-4 last:border-b-0"
            >
              <TeamRow team={v.team} role={v.role} client={props.client} />
            </li>
          );
        })}

        {/* No Result Found */}
        {teamsToShow.length === 0 && (
          <div className="flex h-[200px] items-center justify-center p-4">
            <div className="text-center">
              <p className="mb-3 text-sm">No teams found</p>
              {teamSearchValue && (
                <p className="text-muted-foreground text-sm">
                  Your search for {`"${teamSearchValue}"`} did not match any
                  teams
                </p>
              )}
            </div>
          </div>
        )}
      </ul>
    </div>
  );
}

function TeamRow(props: {
  team: Team;
  role: TeamAccountRole;
  client: ThirdwebClient;
}) {
  const plan = getValidTeamPlan(props.team);

  return (
    <div className="flex items-center justify-between gap-2">
      {/* start */}
      <div className="flex items-center gap-4">
        <GradientAvatar
          className="size-8"
          src={props.team.image}
          id={props.team.id}
          client={props.client}
        />

        <div>
          <div className="flex items-center gap-3">
            <p className="font-semibold text-sm">{props.team.name}</p>
            <TeamPlanBadge plan={plan} />
          </div>
          <p className="text-muted-foreground text-sm capitalize">
            {props.role.toLowerCase()}
          </p>
        </div>
      </div>

      {/* end */}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" className="!h-auto !w-auto p-1.5">
            <EllipsisIcon className="size-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-[180px]">
          <DropdownMenuItem>
            <Link href={`/team/${props.team.slug}`} className="w-full p-1 ">
              View
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Link
              href={`/team/${props.team.slug}/~/settings`}
              className="w-full p-1 "
            >
              Manage
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
