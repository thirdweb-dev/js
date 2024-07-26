"use client";

import type { Team } from "@/api/team";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronsUpDownIcon, PlusCircleIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

type TeamBillingPlan = "free" | "growth" | "pro";

function getPlan(team: Team): TeamBillingPlan {
  switch (true) {
    case team.billingPlan === "pro" && team.billingStatus === "validPayment": {
      return "pro";
    }
    case team.billingPlan === "growth" &&
      team.billingStatus === "validPayment": {
      return "growth";
    }

    default: {
      return "free";
    }
  }
}

interface TeamSwitcherProps extends PopoverTriggerProps {
  activeTeam: Team;
  teams: Team[];
}

export function TeamSwitcher({ teams, activeTeam }: TeamSwitcherProps) {
  const [open, setOpen] = useState(false);

  const teamPlan = getPlan(activeTeam);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="flex flex-row gap-1 items-center">
        <Link
          href={`/team/${activeTeam.slug}`}
          className="font-normal text-sm flex flex-row gap-1 items-center"
        >
          {activeTeam.name}
          <Badge
            variant={
              teamPlan === "free"
                ? "secondary"
                : teamPlan === "growth"
                  ? "success"
                  : "default"
            }
            className="capitalize"
          >
            {teamPlan}
          </Badge>
        </Link>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            className="px-1 w-auto"
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a team"
          >
            <ChevronsUpDownIcon
              className="shrink-0 opacity-50 size-5"
              strokeWidth={1}
            />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent className="w-[200px] p-0 overflow-hidden">
        {teams.map((team) => (
          <Button
            key={team.slug}
            className={cn("w-full justify-between rounded-none")}
            variant="ghost"
            disabled={team.slug === activeTeam.slug}
          >
            {team.name}
            {team.slug === activeTeam.slug && (
              <CheckIcon className="h-4 w-4 shrink-0 opacity-50" />
            )}
          </Button>
        ))}
        <Separator />
        <Button
          className="w-full gap-2 rounded-none justify-start"
          variant="ghost"
          disabled
        >
          <PlusCircleIcon className="h-4 w-4 shrink-0 opacity-50" />
          Create Team
          <Badge className="ml-auto" variant="secondary">
            Soon{"™️"}
          </Badge>
        </Button>
      </PopoverContent>
    </Popover>
  );
}
