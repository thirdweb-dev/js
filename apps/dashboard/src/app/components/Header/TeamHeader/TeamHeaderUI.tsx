import type { Project } from "@/api/projects";
import type { Team } from "@/api/team";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { AccountButton } from "../../../team/[team_slug]/components/account-button.client";
import { ThirdwebMiniLogo } from "../../ThirdwebMiniLogo";
import { MobileBurgerMenuButton } from "./MobileBurgerMenuButton";
import { ProjectSelectorMobileMenuButton } from "./ProjectSelectorMobileMenuButton";
import { ResourcesDropdownButton } from "./ResourcesDropdownButton";
import { TeamAndProjectSelectorPopoverButton } from "./TeamAndProjectSelectorPopoverButton";
import { TeamSelectorMobileMenuButton } from "./TeamSelectorMobileMenuButton";
import { getValidTeamPlan } from "./getValidTeamPlan";

export type TeamHeaderCompProps = {
  currentTeam: Team;
  teamsAndProjects: Array<{ team: Team; projects: Project[] }>;
  currentProject: Project | undefined;
  className?: string;
  email: string | undefined;
  logout: () => void;
  connectButton: React.ReactNode;
};

export function TeamHeaderDesktopUI(props: TeamHeaderCompProps) {
  const { currentTeam } = props;
  const teamPlan = getValidTeamPlan(currentTeam);

  return (
    <header
      className={cn(
        "flex flex-row gap-2 items-center bg-background text-foreground justify-between px-6 py-4",
        props.className,
      )}
    >
      <div className="flex items-center gap-2">
        <ThirdwebMiniLogo className="h-5" />

        <SlashSeparator />

        <div className="flex items-center gap-1">
          <Link
            href={`/team/${currentTeam.slug}`}
            className="font-normal text-sm flex flex-row gap-2 items-center text-foreground"
          >
            {/* TODO - replace with team image */}
            <div className="bg-border size-7 rounded-full" />

            <span className="font-semibold"> {currentTeam.name} </span>
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

          <TeamAndProjectSelectorPopoverButton
            currentProject={props.currentProject}
            currentTeam={props.currentTeam}
            teamsAndProjects={props.teamsAndProjects}
            focus="team-selection"
          />
        </div>

        {props.currentProject && (
          <>
            <SlashSeparator />
            <div className="flex items-center gap-1">
              <Link
                href={`/team/${props.currentTeam.slug}/${props.currentProject.slug}`}
                className="font-semibold text-sm flex flex-row gap-1 items-center"
              >
                {props.currentProject.name}
              </Link>

              <TeamAndProjectSelectorPopoverButton
                currentProject={props.currentProject}
                currentTeam={props.currentTeam}
                teamsAndProjects={props.teamsAndProjects}
                focus="project-selection"
              />
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-6">
        <ResourcesDropdownButton />

        <Link
          href="/support"
          className="text-muted-foreground text-sm hover:text-foreground"
        >
          Support
        </Link>

        <Link
          href="https://portal.thirdweb.com/"
          className="text-muted-foreground text-sm hover:text-foreground"
        >
          Docs
        </Link>

        <AccountButton
          email={props.email}
          logout={props.logout}
          connectButton={props.connectButton}
        />
      </div>
    </header>
  );
}

function SlashSeparator() {
  return (
    <div className="h-5 w-[1px] bg-muted-foreground rotate-[25deg] mx-2" />
  );
}

export function TeamHeaderMobileUI(props: TeamHeaderCompProps) {
  const { currentTeam } = props;
  const projects = props.teamsAndProjects.find(
    (x) => x.team.slug === props.currentTeam.slug,
  )?.projects;

  return (
    <header
      className={cn(
        "flex flex-row gap-2 items-center bg-background text-foreground justify-between px-4 py-4",
        props.className,
      )}
    >
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Link
            href={`/team/${currentTeam.slug}`}
            className={cn(
              "font-normal text-sm flex flex-row items-center text-foreground gap-2",
            )}
          >
            {/* TODO - replace with team image */}
            <div className="bg-border size-7 rounded-full" />

            {!props.currentProject && (
              <span className="font-semibold">{currentTeam.name}</span>
            )}
          </Link>

          <TeamSelectorMobileMenuButton
            currentTeam={props.currentTeam}
            teamsAndProjects={props.teamsAndProjects}
          />
        </div>

        {props.currentProject && projects && (
          <>
            <SlashSeparator />
            <div className="flex items-center gap-1">
              <Link
                href={`/team/${props.currentTeam.slug}/${props.currentProject.slug}`}
                className="font-semibold text-sm truncate max-lg:max-w-[130px]"
              >
                {props.currentProject.name}
              </Link>

              <ProjectSelectorMobileMenuButton
                currentProject={props.currentProject}
                projects={projects}
                team={props.currentTeam}
              />
            </div>
          </>
        )}
      </div>

      <MobileBurgerMenuButton
        email={props.email}
        logout={props.logout}
        connectButton={props.connectButton}
      />
    </header>
  );
}
