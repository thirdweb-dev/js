import { notFound, redirect } from "next/navigation";
import { getProject } from "../../../../../../../../../@/api/projects";
import { CodeServer } from "../../../../../../../../../@/components/ui/code/code.server";
import { getSingleTransaction } from "../../lib/analytics";

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
    <div className="p-4">
      <h1 className="mb-4 font-bold text-2xl">Transaction Details</h1>
      {/* TODO: add transaction details UI */}
      <CodeServer lang="json" code={JSON.stringify(transactionData, null, 2)} />
    </div>
  );
}
