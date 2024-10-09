import { DashboardTypeCookieSetter } from "@/components/DashboardTypeCookieSetter";
import { AppFooter } from "@/components/blocks/app-footer";
import { TeamsUIBanner } from "../../components/DashboardTypeBanner";
import { TWAutoConnect } from "../../components/autoconnect";

export default function RootTeamLayout(props: {
  children: React.ReactNode;
  params: { team_slug: string };
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <TeamsUIBanner />
      <div className="flex grow flex-col">{props.children}</div>
      <TWAutoConnect />
      <AppFooter />
      <DashboardTypeCookieSetter type="team" />
    </div>
  );
}
