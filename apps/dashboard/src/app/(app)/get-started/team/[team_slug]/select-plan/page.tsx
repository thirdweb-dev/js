import { type Team, getTeamBySlug } from "@/api/team";
import { notFound } from "next/navigation";
import { getAuthToken } from "../../../../api/lib/getAuthToken";
import { TeamOnboardingLayout } from "../../../../login/onboarding/onboarding-layout";
import { PlanSelector } from "./_components/plan-selector";

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

  // const client = getClientThirdwebClient({
  //   jwt: authToken,
  //   teamId: team.id,
  // });

  async function getTeam() {
    "use server";
    const resolvedTeam = await getTeamBySlug(params.team_slug);
    if (!resolvedTeam) {
      return team as Team;
    }
    return resolvedTeam;
  }

  return (
    <TeamOnboardingLayout currentStep={2}>
      <PlanSelector team={team} getTeam={getTeam} />
    </TeamOnboardingLayout>
  );
}
