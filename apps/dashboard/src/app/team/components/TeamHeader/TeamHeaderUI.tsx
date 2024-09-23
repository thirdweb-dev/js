import type { Project } from "@/api/projects";
import type { Team } from "@/api/team";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { SecondaryNav } from "../../../components/Header/SecondaryNav/SecondaryNav";
import { MobileBurgerMenuButton } from "../../../components/MobileBurgerMenuButton";
import { TeamPlanBadge } from "../../../components/TeamPlanBadge";
import { ThirdwebMiniLogo } from "../../../components/ThirdwebMiniLogo";
import { ProjectSelectorMobileMenuButton } from "./ProjectSelectorMobileMenuButton";
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
  createProject: () => void;
};

export function TeamHeaderDesktopUI(props: TeamHeaderCompProps) {
  const { currentTeam } = props;
  const teamPlan = getValidTeamPlan(currentTeam);

  return (
    <header
      className={cn(
        "flex flex-row items-center justify-between gap-2 px-6 py-4 text-foreground",
        props.className,
      )}
    >
      <div className="flex items-center gap-2">
        <Link href="/team">
          <ThirdwebMiniLogo className="h-5" />
        </Link>

        <SlashSeparator />

        <div className="flex items-center gap-1">
          <Link
            href={`/team/${currentTeam.slug}`}
            className="flex flex-row items-center gap-2 font-normal text-sm"
          >
            {/* TODO - replace with team image */}
            <div className="size-6 rounded-full border border-border bg-muted" />

            <span> {currentTeam.name} </span>
            <TeamPlanBadge plan={teamPlan} />
          </Link>

          <TeamAndProjectSelectorPopoverButton
            currentProject={props.currentProject}
            currentTeam={props.currentTeam}
            teamsAndProjects={props.teamsAndProjects}
            focus="team-selection"
            createProject={props.createProject}
          />
        </div>

        {props.currentProject && (
          <>
            <SlashSeparator />
            <div className="flex items-center gap-1">
              <Link
                href={`/team/${props.currentTeam.slug}/${props.currentProject.slug}`}
                className="flex flex-row items-center gap-1 font-semibold text-sm"
              >
                {props.currentProject.name}
              </Link>

              <TeamAndProjectSelectorPopoverButton
                currentProject={props.currentProject}
                currentTeam={props.currentTeam}
                teamsAndProjects={props.teamsAndProjects}
                focus="project-selection"
                createProject={props.createProject}
              />
            </div>
          </>
        )}
      </div>

      <SecondaryNav
        email={props.email}
        logout={props.logout}
        connectButton={props.connectButton}
      />
    </header>
  );
}

function SlashSeparator() {
  return <div className="mx-2 h-5 w-[1.5px] rotate-[25deg] bg-foreground/30" />;
}

export function TeamHeaderMobileUI(props: TeamHeaderCompProps) {
  const { currentTeam } = props;
  const projects = props.teamsAndProjects.find(
    (x) => x.team.slug === props.currentTeam.slug,
  )?.projects;

  return (
    <header
      className={cn(
        "flex flex-row items-center justify-between gap-2 px-4 py-4 text-foreground",
        props.className,
      )}
    >
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Link
            href={`/team/${currentTeam.slug}`}
            className={cn(
              "flex flex-row items-center gap-2 font-normal text-foreground text-sm",
            )}
          >
            {/* TODO - replace with team image */}
            <div className="size-7 rounded-full border border-border bg-muted" />

            {!props.currentProject && (
              <span className="font-semibold">{currentTeam.name}</span>
            )}
          </Link>

          <TeamSelectorMobileMenuButton
            currentTeam={props.currentTeam}
            teamsAndProjects={props.teamsAndProjects}
            upgradeTeamLink={`/team/${currentTeam.slug}/settings`}
          />
        </div>

        {props.currentProject && projects && (
          <>
            <SlashSeparator />
            <div className="flex items-center gap-1">
              <Link
                href={`/team/${props.currentTeam.slug}/${props.currentProject.slug}`}
                className="truncate font-semibold text-sm max-lg:max-w-[130px]"
              >
                {props.currentProject.name}
              </Link>

              <ProjectSelectorMobileMenuButton
                currentProject={props.currentProject}
                projects={projects}
                team={props.currentTeam}
                createProject={props.createProject}
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
