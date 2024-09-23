import type { Project } from "@/api/projects";
import type { Team } from "@/api/team";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { SecondaryNav } from "../../components/Header/SecondaryNav/SecondaryNav";
import { MobileBurgerMenuButton } from "../../components/MobileBurgerMenuButton";
import { ThirdwebMiniLogo } from "../../components/ThirdwebMiniLogo";
import { TeamAndProjectSelectorPopoverButton } from "../../team/components/TeamHeader/TeamAndProjectSelectorPopoverButton";
import { TeamSelectorMobileMenuButton } from "../../team/components/TeamHeader/TeamSelectorMobileMenuButton";

export type AccountHeaderCompProps = {
  className?: string;
  email: string | undefined;
  logout: () => void;
  connectButton: React.ReactNode;
  teamsAndProjects: Array<{ team: Team; projects: Project[] }>;
  createProject: () => void;
};

export function AccountHeaderDesktopUI(props: AccountHeaderCompProps) {
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
            href="/account"
            className="flex flex-row items-center gap-2 font-normal text-sm"
          >
            {/* TODO - replace with account image */}
            <div className="size-6 rounded-full border border-border bg-muted" />
            <span> My Account </span>
          </Link>

          <TeamAndProjectSelectorPopoverButton
            currentProject={undefined}
            currentTeam={undefined}
            teamsAndProjects={props.teamsAndProjects}
            focus="team-selection"
            createProject={props.createProject}
          />
        </div>
      </div>

      <SecondaryNav
        email={props.email}
        logout={props.logout}
        connectButton={props.connectButton}
      />
    </header>
  );
}

export function AccountHeaderMobileUI(props: AccountHeaderCompProps) {
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
            href="/account"
            className={cn(
              "flex flex-row items-center gap-2 font-normal text-foreground text-sm",
            )}
          >
            {/* TODO - replace with account image */}
            <div className="size-7 rounded-full border border-border bg-muted" />
            <span> My Account </span>
          </Link>

          <TeamSelectorMobileMenuButton
            currentTeam={undefined}
            teamsAndProjects={props.teamsAndProjects}
            upgradeTeamLink={undefined}
          />
        </div>
      </div>

      <MobileBurgerMenuButton
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
