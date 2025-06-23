import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getTeamBySlug, hasToCompleteTeamOnboarding } from "@/api/team";
import { EnsureValidConnectedWalletLoginServer } from "@/components/misc/EnsureValidConnectedWalletLogin/EnsureValidConnectedWalletLoginServer";
import { getAuthToken } from "../../../../@/api/auth-token";
import { SaveLastVisitedTeamPage } from "../components/last-visited-page/SaveLastVisitedPage";
import {
  PastDueBanner,
  ServiceCutOffBanner,
} from "./(team)/_components/BillingAlertBanners";

export default async function RootTeamLayout(props: {
  children: React.ReactNode;
  params: Promise<{ team_slug: string }>;
}) {
  const { team_slug } = await props.params;

  const [authToken, team] = await Promise.all([
    getAuthToken(),
    getTeamBySlug(team_slug).catch(() => null),
  ]);

  if (!team) {
    redirect("/team");
  }

  if (!authToken) {
    redirect("/login");
  }

  if (await hasToCompleteTeamOnboarding(team, `/team/${team_slug}`)) {
    redirect(`/get-started/team/${team.slug}`);
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="flex grow flex-col">
        {(() => {
          // Show only one banner at a time following priority:
          // 1. Service cut off (invalid payment)
          // 2. Past due invoices
          // 3. Starter legacy plan discontinued notice
          if (team.billingStatus === "invalidPayment") {
            return <ServiceCutOffBanner teamSlug={team_slug} />;
          }

          if (team.billingStatus === "pastDue") {
            return <PastDueBanner teamSlug={team_slug} />;
          }

          return null;
        })()}

        {props.children}
      </div>

      <SaveLastVisitedTeamPage teamId={team.id} />

      <Suspense fallback={null}>
        <EnsureValidConnectedWalletLoginServer />
      </Suspense>
    </div>
  );
}
