import type { Project } from "@/api/projects";
import type { Team } from "@/api/team";
import { GradientAvatar } from "@/components/blocks/Avatars/GradientAvatar";
import { ProjectAvatar } from "@/components/blocks/Avatars/ProjectAvatar";
import { cn } from "@/lib/utils";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import Link from "next/link";
import type { ThirdwebClient } from "thirdweb";
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
  account: Pick<Account, "email" | "id"> | undefined;
  logout: () => void;
  connectButton: React.ReactNode;
  createProject: (team: Team) => void;
  client: ThirdwebClient;
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
            <GradientAvatar
              id={currentTeam.id}
              src={currentTeam.image || ""}
              className="size-6"
              client={props.client}
            />
            <span> {currentTeam.name} </span>
            <TeamPlanBadge plan={teamPlan} />
          </Link>

          <TeamAndProjectSelectorPopoverButton
            currentProject={props.currentProject}
            currentTeam={props.currentTeam}
            teamsAndProjects={props.teamsAndProjects}
            focus="team-selection"
            createProject={props.createProject}
            account={props.account}
          />
        </div>

        {props.currentProject && (
          <>
            <SlashSeparator />
            <div className="flex items-center gap-1">
              <Link
                href={`/team/${props.currentTeam.slug}/${props.currentProject.slug}`}
                className="flex flex-row items-center gap-2 font-semibold text-sm"
              >
                {/* TODO - set project avatar image */}
                <ProjectAvatar src="" className="size-6" />
                {props.currentProject.name}
              </Link>

              <TeamAndProjectSelectorPopoverButton
                currentProject={props.currentProject}
                currentTeam={props.currentTeam}
                teamsAndProjects={props.teamsAndProjects}
                focus="project-selection"
                createProject={props.createProject}
                account={props.account}
              />
            </div>
          </>
        )}
      </div>

      <SecondaryNav
        account={props.account}
        logout={props.logout}
        connectButton={props.connectButton}
        client={props.client}
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
      <div className="flex items-center gap-1.5">
        <div className="flex items-center gap-1">
          <Link
            href={`/team/${currentTeam.slug}`}
            className={cn(
              "flex flex-row items-center gap-2 font-normal text-foreground text-sm",
            )}
          >
            <GradientAvatar
              id={currentTeam.id}
              src={currentTeam.image || ""}
              className="size-6"
              client={props.client}
            />

            {!props.currentProject && (
              <span className="font-semibold">{currentTeam.name}</span>
            )}
          </Link>

          <TeamSelectorMobileMenuButton
            currentTeam={props.currentTeam}
            teamsAndProjects={props.teamsAndProjects}
            upgradeTeamLink={`/team/${currentTeam.slug}/settings`}
            account={props.account}
          />
        </div>

        {props.currentProject && projects && (
          <>
            <SlashSeparator />
            <div className="flex items-center gap-1">
              <Link
                href={`/team/${props.currentTeam.slug}/${props.currentProject.slug}`}
                className="flex items-center gap-2 font-semibold text-sm"
              >
                <span className="truncate max-sm:max-w-[130px]">
                  {props.currentProject.name}
                </span>
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
        type="loggedIn"
        email={props.account?.email}
        logout={props.logout}
        connectButton={props.connectButton}
      />
    </header>
  );
}
