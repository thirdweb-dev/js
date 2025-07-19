import { redirect } from "next/navigation";
import { getTeamBySlug } from "@/api/team";
import { SupportHeader } from "./_components/SupportHeader";

export default async function Layout(props: {
  params: Promise<{ team_slug: string }>;
  children: React.ReactNode;
}) {
  const params = await props.params;
  const team = await getTeamBySlug(params.team_slug);

  if (!team) {
    redirect("/team");
  }

  return (
    <div className="flex grow flex-col">
      <SupportHeader
        teamSlug={team.slug}
        isFreePlan={team.billingPlan === "free"}
      />
      <div className="container max-w-5xl pt-6 pb-10 flex flex-col grow">
        {props.children}
      </div>
    </div>
  );
}
