"use client";

import { EllipsisIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import type { ThirdwebClient } from "thirdweb";
import { createTeam } from "@/actions/team/createTeam";
import type { Team } from "@/api/team/get-team";
import type { TeamAccountRole } from "@/api/team/team-members";
import { GradientAvatar } from "@/components/blocks/avatar/gradient-avatar";
import { TeamPlanBadge } from "@/components/blocks/TeamPlanBadge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { getValidTeamPlan } from "@/utils/getValidTeamPlan";
import { SearchInput } from "../components/SearchInput";

export function AccountTeamsUI(props: {
  teamsWithRole: {
    team: Team;
    role: TeamAccountRole;
  }[];
  client: ThirdwebClient;
}) {
  const router = useDashboardRouter();
  const [teamSearchValue, setTeamSearchValue] = useState("");
  const teamsToShow = !teamSearchValue
    ? props.teamsWithRole
    : props.teamsWithRole.filter((v) => {
        return v.team.name
          .toLowerCase()
          .includes(teamSearchValue.toLowerCase());
      });

  const createTeamAndRedirect = () => {
    toast.promise(
      createTeam().then((res) => {
        if (res.status === "error") {
          throw new Error(res.errorMessage);
        }
        router.push(`/team/${res.data.slug}`);
      }),
      {
        error: "Failed to create team",
        loading: "Creating team",
        success: "Team created",
      },
    );
  };

  return (
    <div>
      <div className="flex flex-col items-start gap-4 lg:flex-row lg:justify-between">
        <div>
          <h2 className="mb-0.5 font-semibold text-xl tracking-tight">Teams</h2>
          <p className="text-muted-foreground text-sm">
            The teams that are associated with your thirdweb account
          </p>
        </div>

        <Button className="gap-2 max-sm:w-full" onClick={createTeamAndRedirect}>
          <PlusIcon className="size-4" />
          Create Team
        </Button>
      </div>

      <div className="h-4" />

      <SearchInput
        onValueChange={setTeamSearchValue}
        placeholder="Search Teams"
        value={teamSearchValue}
      />

      <div className="h-4" />

      <ul className="rounded-lg border bg-card">
        {/* Teams List */}
        {teamsToShow.map((v) => {
          return (
            <li
              className="border-border border-b p-4 last:border-b-0"
              key={v.team.id}
            >
              <TeamRow client={props.client} role={v.role} team={v.team} />
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
          client={props.client}
          id={props.team.id}
          src={props.team.image || ""}
        />

        <div>
          <div className="flex items-center gap-3">
            <p className="font-semibold text-sm">{props.team.name}</p>
            <TeamPlanBadge plan={plan} teamSlug={props.team.slug} />
          </div>
          <p className="text-muted-foreground text-sm capitalize">
            {props.role.toLowerCase()}
          </p>
        </div>
      </div>

      {/* end */}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="!h-auto !w-auto p-1.5" size="icon" variant="ghost">
            <EllipsisIcon className="size-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-[180px]">
          <DropdownMenuItem>
            <Link className="w-full p-1 " href={`/team/${props.team.slug}`}>
              View
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Link
              className="w-full p-1 "
              href={`/team/${props.team.slug}/~/settings`}
            >
              Manage
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
