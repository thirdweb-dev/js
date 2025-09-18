import { notFound, redirect } from "next/navigation";
import {
  fetchClientSecret,
  getStripeSessionById,
} from "@/actions/stripe-actions";
import { getAuthToken } from "@/api/auth-token";
import { getTeamBySlug } from "@/api/team/get-team";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { pollWithTimeout } from "@/utils/pollWithTimeout";
import { TeamOnboardingLayout } from "../../../../../login/onboarding/onboarding-layout";
import { GrowthPlanCheckout } from "./_components/stripe-checkout";

export default async function Page(props: {
  params: Promise<{ team_slug: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const [params, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ]);
  const [team, authToken] = await Promise.all([
    getTeamBySlug(params.team_slug),
    getAuthToken(),
  ]);

  if (!team || !authToken) {
    notFound();
  }

  // IF we have a session id, check if the session was completed successfully
  let error: string | null = null;
  if (searchParams.session_id) {
    const session = await getStripeSessionById(searchParams.session_id);

    switch (session.status) {
      case "complete": {
        // poll the team until it shows as "growth" plan (to handle race condition with stripe webhook)
        await pollWithTimeout({
          shouldStop: async () => {
            const refreshedTeam = await getTeamBySlug(team.slug);
            return refreshedTeam?.billingPlan === "growth";
          },
          timeoutMs: 5000,
        });
        redirect(`/get-started/team/${team.slug}/add-members`);
        break;
      }
      case "open": {
        error =
          "Something went wrong when trying to process your payment method. Please try again.";
        break;
      }
      default: {
        error = "Please try again later.";
        break;
      }
    }
  }

  return (
    <TeamOnboardingLayout currentStep={2}>
      <div className="rounded-lg border bg-card overflow-hidden py-4 md:py-8">
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Failed to proces subscription</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <GrowthPlanCheckout team={team} fetchClientSecret={fetchClientSecret} />
      </div>
    </TeamOnboardingLayout>
  );
}
