import { getTeamBySlug } from "@/api/team";
import { PosthogIdentifierServer } from "components/wallets/PosthogIdentifierServer";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getAuthToken } from "../../api/lib/getAuthToken";
import { EnsureValidConnectedWalletLoginServer } from "../../components/EnsureValidConnectedWalletLogin/EnsureValidConnectedWalletLoginServer";
import { isTeamOnboardingComplete } from "../../login/onboarding/isOnboardingRequired";
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
  const authToken = await getAuthToken();
  const team = await getTeamBySlug(team_slug).catch(() => null);

  if (!team) {
    redirect("/team");
  }

  if (!authToken) {
    redirect("/login");
  }

  if (!isTeamOnboardingComplete(team)) {
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
      <Suspense fallback={null}>
        <PosthogIdentifierServer />
      </Suspense>
    </div>
  );
}
