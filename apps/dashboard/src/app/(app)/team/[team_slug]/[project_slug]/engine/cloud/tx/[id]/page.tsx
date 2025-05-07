import { getProject } from "@/api/projects";
import { notFound, redirect } from "next/navigation";
import { getSingleTransaction } from "../../lib/analytics";
import { TransactionDetailsUI } from "./transaction-details-ui";

export default async function TransactionPage({
  params,
}: {
  params: Promise<{ team_slug: string; project_slug: string; id: string }>;
}) {
  const { team_slug, project_slug, id } = await params;

  const project = await getProject(team_slug, project_slug);

  if (!project) {
    redirect(`/team/${team_slug}`);
  }

  const transactionData = await getSingleTransaction({
    teamId: project.teamId,
    clientId: project.publishableKey,
    transactionId: id,
  });

  if (!transactionData) {
    notFound();
  }

  return (
    <div className="space-y-6 p-2">
      <TransactionDetailsUI
        transaction={transactionData}
        teamSlug={team_slug}
        project={project}
      />
    </div>
  );
}
