import { CirclePlusIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import type { Project } from "@/api/project/projects";
import type { Team } from "@/api/team/get-team";
import { GradientAvatar } from "@/components/blocks/avatar/gradient-avatar";
import { TeamPlanBadge } from "@/components/blocks/TeamPlanBadge";
import { Button } from "@/components/ui/button";
import { ScrollShadow } from "@/components/ui/ScrollShadow/ScrollShadow";
import { Separator } from "@/components/ui/separator";
import type { Account } from "@/hooks/useApi";
import { cn } from "@/lib/utils";
import { getValidTeamPlan } from "@/utils/getValidTeamPlan";
import { SearchInput } from "./SearchInput";
import { TeamVerifiedIcon } from "./team-verified-icon";

export function TeamSelectionUI(props: {
  setHoveredTeam: (team: Team | undefined) => void;
  currentTeam: Team | undefined;
  teamsAndProjects: Array<{ team: Team; projects: Project[] }>;
  upgradeTeamLink: string | undefined;
  account: Pick<Account, "email" | "id" | "image"> | undefined;
  client: ThirdwebClient;
  isOnProjectPage: boolean;
  createTeam: () => void;
}) {
  const { setHoveredTeam, currentTeam, teamsAndProjects } = props;
  const pathname = usePathname();
  const teamPlan = currentTeam ? getValidTeamPlan(currentTeam) : undefined;
  const teams = teamsAndProjects.map((x) => x.team);
  const [searchTeamTerm, setSearchTeamTerm] = useState("");
  const filteredTeams = searchTeamTerm
    ? teams.filter((team) =>
        team.name.toLowerCase().includes(searchTeamTerm.toLowerCase()),
      )
    : teams;

  return (
    <div className="flex flex-col">
      <SearchInput
        onValueChange={setSearchTeamTerm}
        placeholder="Search Teams"
        value={searchTeamTerm}
      />
      <Separator />
      <ScrollShadow
        className="grow"
        scrollableClassName="max-h-[400px] lg:max-h-[600px]"
      >
        <div className="flex flex-col p-2">
          <Button
            asChild
            className={cn("w-full justify-start gap-2 px-2")}
            onMouseEnter={() => setHoveredTeam(undefined)}
            variant="ghost"
          >
            <Link href="/account">
              <GradientAvatar
                className="size-4"
                client={props.client}
                id={props.account?.id}
                src={props.account?.image || ""}
              />
              My Account
            </Link>
          </Button>

          <h2 className="mx-2 mt-4 mb-2 font-medium text-muted-foreground text-xs">
            Teams
          </h2>

          <ul>
            {filteredTeams.map((team) => {
              const isSelected = team.id === currentTeam?.id;
              return (
                // biome-ignore lint/a11y/useKeyWithMouseEvents: FIXME
                <li
                  className="py-0.5"
                  key={team.id}
                  onMouseOver={() => {
                    setHoveredTeam(team);
                  }}
                >
                  <Button
                    asChild
                    className={cn(
                      "!opacity-100 w-full justify-between gap-2 pl-2",
                      isSelected && "bg-accent",
                    )}
                    variant="ghost"
                  >
                    <Link
                      href={
                        currentTeam &&
                        !props.isOnProjectPage &&
                        pathname.startsWith("/team")
                          ? pathname.replace(
                              `/team/${currentTeam.slug}`,
                              `/team/${team.slug}`,
                            )
                          : `/team/${team.slug}`
                      }
                    >
                      <div className="flex items-center gap-2">
                        <GradientAvatar
                          className="size-4"
                          client={props.client}
                          id={team.id}
                          src={team.image || ""}
                        />

                        <span className="truncate"> {team.name} </span>
                        <TeamVerifiedIcon domain={team.verifiedDomain} />
                      </div>

                      <TeamPlanBadge
                        plan={team.billingPlan}
                        teamSlug={team.slug}
                      />
                    </Link>
                  </Button>
                </li>
              );
            })}

            <li className="py-0.5">
              <Button
                className="w-full justify-start gap-2 px-2"
                onClick={props.createTeam}
                variant="ghost"
              >
                <CirclePlusIcon className="size-4 text-link-foreground" />
                Create Team
              </Button>
            </li>
          </ul>
        </div>
      </ScrollShadow>
      {/* Bottom */}
      {teamPlan && teamPlan !== "pro" && props.upgradeTeamLink && (
        <div className="border-border border-t p-2">
          <Button
            asChild
            className="w-full"
            onMouseEnter={() => setHoveredTeam(undefined)}
            variant="primary"
          >
            <Link href={props.upgradeTeamLink}>Upgrade Team</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
