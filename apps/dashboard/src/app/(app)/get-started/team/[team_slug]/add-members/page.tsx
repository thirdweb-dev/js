import { getTeamBySlug } from "@/api/team";
import { notFound } from "next/navigation";
import { getClientThirdwebClient } from "../../../../../../@/constants/thirdweb-client.client";
import { getAuthToken } from "../../../../api/lib/getAuthToken";
import { TeamOnboardingLayout } from "../../../../login/onboarding/onboarding-layout";
import { InviteTeamMembers } from "../../../../login/onboarding/team-onboarding/team-onboarding";

export default async function Page(props: {
  params: Promise<{ team_slug: string }>;
}) {
  const params = await props.params;
  const [team, authToken] = await Promise.all([
    getTeamBySlug(params.team_slug),
    getAuthToken(),
  ]);

  if (!team || !authToken) {
    notFound();
  }

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: team.id,
  });

  return (
    <TeamOnboardingLayout currentStep={2}>
      <InviteTeamMembers team={team} client={client} />
    </TeamOnboardingLayout>
  );
}
