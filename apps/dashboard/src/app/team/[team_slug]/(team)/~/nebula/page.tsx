import { getTeamBySlug, getTeamNebulaWaitList } from "@/api/team";
import { redirect } from "next/navigation";
import { JoinNebulaWaitlistPage } from "../../../[project_slug]/nebula/components/nebula-waitlist-page.client";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
  }>;
}) {
  const params = await props.params;
  const team = await getTeamBySlug(params.team_slug);

  if (!team) {
    redirect(
      `/login?next=${encodeURIComponent(`/team/${params.team_slug}/~/nebula`)}`,
    );
  }

  const nebulaWaitList = await getTeamNebulaWaitList(team.slug);

  // this should never happen
  if (!nebulaWaitList) {
    return (
      <div className="container flex grow flex-col py-8">
        <div className="flex min-h-[300px] grow flex-col items-center justify-center rounded-lg border p-6 text-destructive-text">
          Something went wrong trying to fetch the nebula waitlist
        </div>
      </div>
    );
  }

  return (
    <JoinNebulaWaitlistPage
      onWaitlist={nebulaWaitList.onWaitlist}
      teamSlug={team.slug}
    />
  );
}
