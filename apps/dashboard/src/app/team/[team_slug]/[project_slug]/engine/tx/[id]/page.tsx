import { getSingleTransaction } from "../../lib/analytics";

export default async function TransactionPage({
  params,
}: {
  params: { team_slug: string; project_slug: string; id: string };
}) {
  const transactionData = await getSingleTransaction({
    teamId: params.team_slug,
    clientId: params.project_slug,
    transactionId: params.id,
  });

  return (
    <div className="p-4">
      <h1 className="mb-4 font-bold text-2xl">Transaction Details</h1>
      <pre className="overflow-auto rounded-lg bg-gray-100 p-4">
        {JSON.stringify(transactionData, null, 2)}
      </pre>
    </div>
  );
}
