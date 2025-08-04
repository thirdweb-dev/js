import { redirect } from "next/navigation";
import { getTeamBySlug } from "@/api/team/get-team";
import { UpsellWrapper } from "@/components/blocks/upsell-wrapper";

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{
    team_slug: string;
  }>;
}) {
  const params = await props.params;
  const team = await getTeamBySlug(params.team_slug);
  if (!team) {
    redirect("/team");
  }
  return (
    <UpsellWrapper
      currentPlan={team.billingPlan}
      featureDescription="Monitor and review every action performed in your team with detailed audit logs."
      featureName="Audit Log"
      isLocked={team.billingPlan !== "scale" && team.billingPlan !== "pro"}
      requiredPlan="scale"
      teamSlug={params.team_slug}
    >
      <div className="flex grow flex-col">
        <div className="border-border border-b py-10">
          <div className="container max-w-5xl flex flex-row justify-between">
            <h1 className="font-semibold text-3xl tracking-tight lg:px-2">
              Audit Log
            </h1>
          </div>
        </div>
        <div className="container max-w-5xl flex flex-col gap-8 pt-6 pb-10">
          {props.children}
        </div>
      </div>
    </UpsellWrapper>
  );
}
