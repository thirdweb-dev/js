import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import Link from "next/link";
import type { ThirdwebClient } from "thirdweb";
import type { Project } from "@/api/projects";
import type { Team } from "@/api/team";
import { GradientAvatar } from "@/components/blocks/Avatars/GradientAvatar";
import { ProjectAvatar } from "@/components/blocks/Avatars/ProjectAvatar";
import { cn } from "@/lib/utils";
import { NotificationsButton } from "../../../../../@/components/blocks/notifications/notification-button";
import { SecondaryNav } from "../../../components/Header/SecondaryNav/SecondaryNav";
import { MobileBurgerMenuButton } from "../../../components/MobileBurgerMenuButton";
import { TeamPlanBadge } from "../../../components/TeamPlanBadge";
import { ThirdwebMiniLogo } from "../../../components/ThirdwebMiniLogo";
import { getValidTeamPlan } from "./getValidTeamPlan";
import { ProjectSelectorMobileMenuButton } from "./ProjectSelectorMobileMenuButton";
import { TeamAndProjectSelectorPopoverButton } from "./TeamAndProjectSelectorPopoverButton";
import { TeamSelectorMobileMenuButton } from "./TeamSelectorMobileMenuButton";
import { TeamVerifiedIcon } from "./team-verified-icon";

export type TeamHeaderCompProps = {
  currentTeam: Team;
  teamsAndProjects: Array<{ team: Team; projects: Project[] }>;
  currentProject: Project | undefined;
  className?: string;
  account: Pick<Account, "email" | "id">;
  logout: () => void;
  connectButton: React.ReactNode;
  createProject: (team: Team) => void;
  createTeam: () => void;
  client: ThirdwebClient;
  accountAddress: string;
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
          <span className="flex flex-row items-center gap-2 font-normal text-sm">
            <Link
              className="flex flex-row items-center gap-2 font-normal text-sm"
              href={`/team/${currentTeam.slug}`}
            >
              <GradientAvatar
                className="size-6"
                client={props.client}
                id={currentTeam.id}
                src={currentTeam.image || ""}
              />
              <span> {currentTeam.name} </span>
              <TeamVerifiedIcon domain={currentTeam.verifiedDomain} />
            </Link>
            {/* may render its own link so has to be outside of the link */}
            <TeamPlanBadge plan={teamPlan} teamSlug={currentTeam.slug} />
          </span>

          <TeamAndProjectSelectorPopoverButton
            account={props.account}
            client={props.client}
            createProject={props.createProject}
            createTeam={props.createTeam}
            currentProject={props.currentProject}
            currentTeam={props.currentTeam}
            focus="team-selection"
            teamsAndProjects={props.teamsAndProjects}
          />
        </div>

        {props.currentProject && (
          <>
            <SlashSeparator />
            <div className="flex items-center gap-1">
              <Link
                className="flex flex-row items-center gap-2 font-semibold text-sm"
                href={`/team/${props.currentTeam.slug}/${props.currentProject.slug}`}
              >
                <ProjectAvatar
                  className="size-6"
                  client={props.client}
                  src={props.currentProject.image || ""}
                />
                {props.currentProject.name}
              </Link>

              <TeamAndProjectSelectorPopoverButton
                account={props.account}
                client={props.client}
                createProject={props.createProject}
                createTeam={props.createTeam}
                currentProject={props.currentProject}
                currentTeam={props.currentTeam}
                focus="project-selection"
                teamsAndProjects={props.teamsAndProjects}
              />
            </div>
          </>
        )}
      </div>

      <SecondaryNav
        account={props.account}
        accountAddress={props.accountAddress}
        client={props.client}
        connectButton={props.connectButton}
        logout={props.logout}
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
            className={cn(
              "flex flex-row items-center gap-2 font-normal text-foreground text-sm",
            )}
            href={`/team/${currentTeam.slug}`}
          >
            <GradientAvatar
              className="size-6"
              client={props.client}
              id={currentTeam.id}
              src={currentTeam.image || ""}
            />

            {!props.currentProject && (
              <div className="flex items-center gap-2">
                <span className="font-semibold">{currentTeam.name}</span>
                <TeamVerifiedIcon domain={currentTeam.verifiedDomain} />
              </div>
            )}
          </Link>

          <TeamSelectorMobileMenuButton
            account={props.account}
            client={props.client}
            createTeam={props.createTeam}
            currentTeam={props.currentTeam}
            isOnProjectPage={!!props.currentProject}
            teamsAndProjects={props.teamsAndProjects}
            upgradeTeamLink={`/team/${currentTeam.slug}/settings`}
          />
        </div>

        {props.currentProject && projects && (
          <>
            <SlashSeparator />
            <div className="flex items-center gap-1">
              <Link
                className="flex items-center gap-2 font-semibold text-sm"
                href={`/team/${props.currentTeam.slug}/${props.currentProject.slug}`}
              >
                <span className="truncate max-sm:max-w-[130px]">
                  {props.currentProject.name}
                </span>
              </Link>

              <ProjectSelectorMobileMenuButton
                client={props.client}
                createProject={props.createProject}
                currentProject={props.currentProject}
                projects={projects}
                team={props.currentTeam}
              />
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-3">
        <NotificationsButton accountId={props.account.id} />

        <MobileBurgerMenuButton
          accountAddress={props.accountAddress}
          client={props.client}
          connectButton={props.connectButton}
          email={props.account.email}
          logout={props.logout}
          type="loggedIn"
        />
      </div>
    </header>
  );
}
