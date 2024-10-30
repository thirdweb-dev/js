import { AnalyticsCallout } from "../../../../team/[team_slug]/[project_slug]/connect/in-app-wallets/_components/AnalyticsCallout";
import { InAppWaletFooterSection } from "../../../../team/[team_slug]/[project_slug]/connect/in-app-wallets/_components/footer";

export default function Layout(props: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {props.children}
      <div className="h-16" />
      {/* Footer */}
      <AnalyticsCallout trackingCategory="embedded-wallet" />
      <div className="h-5" />
      <InAppWaletFooterSection trackingCategory="embedded-wallet" />
    </div>
  );
}
