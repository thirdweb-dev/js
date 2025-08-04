import { XIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getTeamBySlug } from "@/api/team/get-team";
import { UpsellContent } from "@/components/blocks/upsell-wrapper";
import { tryCatch } from "@/utils/try-catch";
import { SupportsCaseList } from "./_components/case-list";
import { getSupportTicketsByTeam } from "./apis/tickets";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
  }>;
}) {
  const params = await props.params;

  const [team, token] = await Promise.all([
    getTeamBySlug(params.team_slug),
    getAuthToken(),
  ]);

  if (!team || !token) {
    notFound();
  }

  if (team.billingPlan === "free") {
    return (
      <div className="flex flex-col grow justify-center items-center">
        <UpsellContent
          currentPlan={team.billingPlan}
          featureDescription="Create support cases for your projects"
          featureName="Support Center"
          requiredPlan="starter"
          teamSlug={params.team_slug}
          benefits={[
            {
              description:
                "Create & Manage all your support requests in one place",
              status: "available",
            },
            {
              description: "Personalized Assistance tailored to your use case",
              status: "available",
            },
          ]}
        />
      </div>
    );
  }

  const supportedTicketsResult = await tryCatch(
    getSupportTicketsByTeam({
      authToken: token,
      teamSlug: team.slug,
    }),
  );

  if (supportedTicketsResult.error) {
    return (
      <div className="min-h-[200px] flex justify-center text-center p-4 items-center border rounded-lg text-sm">
        <div className="flex flex-col gap-3 justify-center items-center">
          <div className="border p-1 rounded-full">
            <XIcon className="size-5 text-muted-foreground" />
          </div>
          <p className="text-sm">Failed to load support tickets</p>
          <p>{supportedTicketsResult.error.message}</p>
        </div>
      </div>
    );
  }

  return <SupportsCaseList team={team} tickets={supportedTicketsResult.data} />;
}
