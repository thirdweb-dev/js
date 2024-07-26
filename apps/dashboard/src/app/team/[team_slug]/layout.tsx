import { getTeams } from "@/api/team";
import { ColorModeToggle } from "@/components/color-mode-toggle";
import { thirdwebClient } from "@/constants/client";
import { redirect } from "next/navigation";
import { ThirdwebMiniLogo } from "../../components/ThirdwebMiniLogo";
import { AccountButton } from "./components/account-button.client";
import { TeamSwitcher } from "./components/team-switcher.client";

export default async function RootTeamLayout(props: {
  children: React.ReactNode;
  breadcrumbNav: React.ReactNode;
  params: { team_slug: string };
}) {
  const teams = await getTeams();
  const team = teams.find((t) => t.slug === props.params.team_slug);

  // if the team doesn't exist, redirect to 404
  if (!team) {
    redirect("/404");
  }

  return (
    <>
      <header className="bg-card flex flex-col gap-2 pt-4">
        <div className="px-6 flex flex-row justify-between items-center">
          <nav className="flex flex-row gap-2 items-center">
            <ThirdwebMiniLogo className="h-6" />
            <div aria-hidden className="text-xl opacity-20 font-light">
              /
            </div>
            <TeamSwitcher activeTeam={team} teams={teams} />
            {props.breadcrumbNav}
          </nav>

          <div className="flex flex-row gap-2 items-center">
            <ColorModeToggle />
            <AccountButton client={thirdwebClient} />
          </div>
        </div>
      </header>

      {props.children}
    </>
  );
}
