import { loginRedirect } from "@app/login/loginRedirect";
import { notFound, redirect } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/projects";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import {
  getSingleTransaction,
  getTransactionActivityLogs,
} from "../../lib/analytics";
import { TransactionDetailsUI } from "./transaction-details-ui";

export default async function TransactionPage({
  params,
}: {
  params: Promise<{ team_slug: string; project_slug: string; id: string }>;
}) {
  const { team_slug, project_slug, id } = await params;

  const [authToken, project] = await Promise.all([
    getAuthToken(),
    getProject(team_slug, project_slug),
  ]);

  if (!authToken) {
    loginRedirect(`/team/${team_slug}/${project_slug}/transactions/tx/${id}`);
  }

  if (!project) {
    redirect(`/team/${team_slug}`);
  }

  const [transactionData, activityLogs] = await Promise.all([
    getSingleTransaction({
      clientId: project.publishableKey,
      teamId: project.teamId,
      transactionId: id,
    }),
    getTransactionActivityLogs({
      clientId: project.publishableKey,
      teamId: project.teamId,
      transactionId: id,
    }),
  ]);

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: project.teamId,
  });

  if (!transactionData) {
    notFound();
  }

  return (
    <div className="space-y-6 p-2">
      <TransactionDetailsUI
        activityLogs={activityLogs}
        client={client}
        project={project}
        teamSlug={team_slug}
        transaction={transactionData}
      />
    </div>
  );
}
