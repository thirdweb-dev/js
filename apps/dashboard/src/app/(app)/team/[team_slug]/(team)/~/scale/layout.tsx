import { RocketIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getTeamBySlug } from "@/api/team";
import { UpsellWrapper } from "@/components/blocks/upsell-wrapper";
import { Button } from "@/components/ui/button";

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
      featureDescription="Deploy and manage RPC, Insight and Account Abstraction infrastructure on any chain."
      featureName="Chain Infrastructure"
      isLocked={
        team.billingPlan !== "growth" &&
        team.billingPlan !== "growth_legacy" &&
        team.billingPlan !== "accelerate" &&
        team.billingPlan !== "scale" &&
        team.billingPlan !== "pro"
      }
      requiredPlan="growth"
      teamSlug={params.team_slug}
    >
      <div className="flex grow flex-col">
        <div className="border-border border-b py-10">
          <div className="container flex flex-row justify-between">
            <h1 className="font-semibold text-3xl tracking-tight lg:px-2">
              Chain Infrastructure
            </h1>
            <Button asChild>
              <Link href={`/team/${params.team_slug}/~/infrastructure/deploy`}>
                Deploy Infrastructure
                <RocketIcon className="size-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="container py-12">{props.children}</div>
      </div>
    </UpsellWrapper>
  );
}
