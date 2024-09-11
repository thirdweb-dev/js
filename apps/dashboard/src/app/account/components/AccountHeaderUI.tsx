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
};

export function AccountHeaderDesktopUI(props: AccountHeaderCompProps) {
  return (
    <header
      className={cn(
        "flex flex-row gap-2 items-center text-foreground justify-between px-6 py-4",
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
            className="font-normal text-sm flex flex-row gap-2 items-center"
          >
            {/* TODO - replace with account image */}
            <div className="bg-muted border border-border size-6 rounded-full" />
            <span> My Account </span>
          </Link>

          <TeamAndProjectSelectorPopoverButton
            currentProject={undefined}
            currentTeam={undefined}
            teamsAndProjects={props.teamsAndProjects}
            focus="team-selection"
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
        "flex flex-row gap-2 items-center text-foreground justify-between px-4 py-4",
        props.className,
      )}
    >
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Link
            href={"/account"}
            className={cn(
              "font-normal text-sm flex flex-row items-center text-foreground gap-2",
            )}
          >
            {/* TODO - replace with account image */}
            <div className="bg-muted border border-border size-7 rounded-full" />
            <span> My Account </span>
          </Link>

          <TeamSelectorMobileMenuButton
            currentTeam={undefined}
            teamsAndProjects={props.teamsAndProjects}
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
  return <div className="h-5 w-[1.5px] bg-foreground/30 rotate-[25deg] mx-2" />;
}
