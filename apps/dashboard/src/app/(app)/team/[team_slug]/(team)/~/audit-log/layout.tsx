import { redirect } from "next/navigation";
import { getTeamBySlug } from "../../../../../../../@/api/team";
import { UpsellWrapper } from "../../../../../../../@/components/blocks/upsell-wrapper";

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
      isLocked={team.billingPlan !== "scale" && team.billingPlan !== "pro"}
      requiredPlan="scale"
      featureName="Audit Log"
      featureDescription="Monitor and review every action performed in your team with detailed audit logs."
      teamSlug={params.team_slug}
      currentPlan={team.billingPlan}
    >
      <div className="flex grow flex-col">
        <div className="border-border border-b py-10">
          <div className="container flex flex-row justify-between">
            <h1 className="font-semibold text-3xl tracking-tight lg:px-2">
              Audit Log
            </h1>
          </div>
        </div>
        {props.children}
      </div>
    </UpsellWrapper>
  );
}
