import { getTeamBySlug } from "@/api/team";
import { OpCreditsGrantedModalWrapperServer } from "components/onboarding/OpCreditsGrantedModalWrapperServer";
import { PosthogIdentifierServer } from "components/wallets/PosthogIdentifierServer";
import { redirect } from "next/navigation";
import { Suspense } from "react";
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
  const team = await getTeamBySlug(team_slug).catch(() => null);

  if (!team) {
    redirect("/team");
  }

  if (!isTeamOnboardingComplete(team)) {
    redirect(`/get-started/team/${team.slug}`);
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="flex grow flex-col">
        {team.billingStatus === "pastDue" && (
          <PastDueBanner teamSlug={team_slug} />
        )}

        {team.billingStatus === "invalidPayment" && (
          <ServiceCutOffBanner teamSlug={team_slug} />
        )}

        {props.children}
      </div>

      <SaveLastVisitedTeamPage teamId={team.id} />

      <Suspense fallback={null}>
        <OpCreditsGrantedModalWrapperServer />
      </Suspense>
      <Suspense fallback={null}>
        <EnsureValidConnectedWalletLoginServer />
      </Suspense>
      <Suspense fallback={null}>
        <PosthogIdentifierServer />
      </Suspense>
    </div>
  );
}
