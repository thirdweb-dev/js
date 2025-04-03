import { StatCard } from "components/analytics/stat";
import { ActivityIcon, CoinsIcon } from "lucide-react";
import { Suspense } from "react";

// TODO: implement this
async function getTransactionAnalyticsSummary(props: {
  teamId: string;
  projectId: string;
}) {
  console.log("getTransactionAnalyticsSummary called with", props);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    foo: 100,
    bar: 200,
  };
}

// TODO: rename props, change labels and icons
function TransactionAnalyticsSummaryUI(props: {
  data:
    | {
        foo: number;
        bar: number;
      }
    | undefined;
  isPending: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <StatCard
        label="Foo"
        value={props.data?.foo}
        icon={ActivityIcon}
        isPending={props.isPending}
      />
      <StatCard
        label="Bar"
        value={props.data?.bar}
        icon={CoinsIcon}
        formatter={(value: number) =>
          new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(value)
        }
        isPending={props.isPending}
      />
    </div>
  );
}

// fetches data and renders the UI
async function AsyncTransactionsAnalyticsSummary(props: {
  teamId: string;
  projectId: string;
}) {
  const data = await getTransactionAnalyticsSummary({
    teamId: props.teamId,
    projectId: props.projectId,
  });

  return <TransactionAnalyticsSummaryUI data={data} isPending={false} />;
}

// shows loading state while fetching data
export function TransactionAnalyticsSummary(props: {
  teamId: string;
  projectId: string;
}) {
  return (
    <Suspense
      fallback={
        <TransactionAnalyticsSummaryUI data={undefined} isPending={true} />
      }
    >
      <AsyncTransactionsAnalyticsSummary
        teamId={props.teamId}
        projectId={props.projectId}
      />
    </Suspense>
  );
}
