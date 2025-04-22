import { getTeamBySlug } from "@/api/team";
import { notFound } from "next/navigation";
import { TeamOnboardingLayout } from "../../../../login/onboarding/onboarding-layout";
import { InviteTeamMembers } from "../../../../login/onboarding/team-onboarding/team-onboarding";

export default async function Page(props: {
  params: Promise<{ team_slug: string }>;
}) {
  const params = await props.params;
  const team = await getTeamBySlug(params.team_slug);

  if (!team) {
    notFound();
  }

  return (
    <TeamOnboardingLayout currentStep={2}>
      <InviteTeamMembers team={team} />
    </TeamOnboardingLayout>
  );
}
