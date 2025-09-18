import { notFound } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getTeamBySlug } from "@/api/team/get-team";
import { TeamOnboardingLayout } from "../../../../../login/onboarding/onboarding-layout";
import { CreateProjectFormOnboarding } from "./_components/create-project-form";

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

  return (
    <TeamOnboardingLayout currentStep={4}>
      <CreateProjectFormOnboarding
        enableNebulaServiceByDefault={true}
        teamSlug={team.slug}
        teamId={team.id}
      />
    </TeamOnboardingLayout>
  );
}
