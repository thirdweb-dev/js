import type { Project } from "@/api/projects";
import type { Team } from "@/api/team";
import { ScrollShadow } from "@/components/ui/ScrollShadow/ScrollShadow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { CheckIcon, CirclePlusIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SearchInput } from "./SearchInput";
import { getValidTeamPlan } from "./getValidTeamPlan";

export function TeamSelectionUI(props: {
  setHoveredTeam: (team: Team | undefined) => void;
  currentTeam: Team;
  teamsAndProjects: Array<{ team: Team; projects: Project[] }>;
}) {
  const { setHoveredTeam, currentTeam, teamsAndProjects } = props;
  const teamPlan = getValidTeamPlan(currentTeam);
  const teams = teamsAndProjects.map((x) => x.team);
  const [searchTeamTerm, setSearchTeamTerm] = useState("");
  const filteredTeams = searchTeamTerm
    ? teams.filter((team) => team.name.includes(searchTeamTerm))
    : teams;

  return (
    <div className="flex flex-col">
      <SearchInput
        placeholder="Search Teams"
        value={searchTeamTerm}
        onValueChange={setSearchTeamTerm}
      />

      <Separator />

      <ScrollShadow
        scrollableClassName="max-h-[400px] lg:max-h-[600px]"
        className="grow"
      >
        <div className="p-2 flex flex-col">
          {/* TODO - onclick */}
          <Button
            className={cn("w-full justify-between !opacity-100 px-2")}
            variant="ghost"
            onMouseEnter={() => setHoveredTeam(undefined)}
          >
            My Account
          </Button>

          <h2 className="text-muted-foreground text-xs mx-2 mb-2 mt-4 font-medium">
            Teams
          </h2>

          <ul>
            {filteredTeams.map((team) => {
              const isSelected = team.slug === currentTeam.slug;
              return (
                // biome-ignore lint/a11y/useKeyWithMouseEvents: <explanation>
                <li
                  key={team.slug}
                  className="py-0.5"
                  onMouseOver={() => {
                    setHoveredTeam(team);
                  }}
                >
                  <Button
                    className={cn(
                      "gap-2 pl-2 w-full justify-between !opacity-100",
                      isSelected && "bg-accent",
                    )}
                    variant="ghost"
                    asChild
                  >
                    <Link href={`/team/${team.slug}`}>
                      <span className="truncate"> {team.name} </span>
                      {isSelected && (
                        <CheckIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                      )}
                    </Link>
                  </Button>
                </li>
              );
            })}

            <li className="py-0.5">
              <Button
                className="px-2 w-full gap-2 justify-start disabled:opacity-100 disabled:pointer-events-auto disabled:cursor-not-allowed"
                variant="ghost"
                disabled
              >
                <CirclePlusIcon className="size-4 text-link-foreground" />
                Create Team
                <Badge className="ml-auto" variant="secondary">
                  Soon{"™️"}
                </Badge>
              </Button>
            </li>
          </ul>
        </div>
      </ScrollShadow>

      {/* TODO - what do we do on this button click? */}
      {/* Bottom */}
      {teamPlan !== "pro" && (
        <div className="p-2 border-t">
          <Button
            variant="primary"
            className="w-full"
            onMouseEnter={() => setHoveredTeam(undefined)}
          >
            Upgrade Team
          </Button>
        </div>
      )}
    </div>
  );
}
