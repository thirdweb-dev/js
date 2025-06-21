import { notFound } from "next/navigation";
import { getTeamBySlug } from "@/api/team";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { getAuthToken } from "../../../api/lib/getAuthToken";
import { loginRedirect } from "../../../login/loginRedirect";
import { TeamOnboardingLayout } from "../../../login/onboarding/onboarding-layout";
import { TeamInfoForm } from "../../../login/onboarding/team-onboarding/team-onboarding";

export default async function Page(props: {
  params: Promise<{ team_slug: string }>;
}) {
  const params = await props.params;
  const [team, authToken] = await Promise.all([
    getTeamBySlug(params.team_slug),
    getAuthToken(),
  ]);

  if (!authToken) {
    loginRedirect(`/get-started/team/${params.team_slug}`);
  }

  if (!team) {
    notFound();
  }

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: team.id,
  });

  return (
    <TeamOnboardingLayout currentStep={1}>
      <TeamInfoForm
        client={client}
        teamId={team.id}
        teamSlug={params.team_slug}
      />
    </TeamOnboardingLayout>
  );
}
