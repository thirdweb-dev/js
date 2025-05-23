import { getTeamBySlug } from "@/api/team";
import { Button } from "@/components/ui/button";
import { PosthogIdentifierServer } from "components/wallets/PosthogIdentifierServer";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
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
        {team.billingPlan === "starter_legacy" && (
          <StarterLegacyDiscontinuedBanner teamSlug={team_slug} />
        )}

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
        <EnsureValidConnectedWalletLoginServer />
      </Suspense>
      <Suspense fallback={null}>
        <PosthogIdentifierServer />
      </Suspense>
    </div>
  );
}

function StarterLegacyDiscontinuedBanner(props: {
  teamSlug: string;
}) {
  return (
    <div className="border-red-600 border-b bg-red-50 px-4 py-6 text-red-800 dark:border-red-700 dark:bg-red-950 dark:text-red-100">
      <div className="text-center">
        <p>Starter legacy plans are being discontinued on May 31, 2025</p>
        <p>
          To prevent service interruptions and losing access to your current
          features select a new plan
        </p>
        <Button
          asChild
          size="sm"
          className="mt-3 gap-2 border border-red-600 bg-red-100 text-red-800 hover:bg-red-200 dark:border-red-700 dark:bg-red-900 dark:text-red-100 dark:hover:bg-red-800"
        >
          <Link
            href={`/team/${props.teamSlug}/~/settings/billing?showPlans=true`}
          >
            Select a new plan
            <ArrowRightIcon className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
