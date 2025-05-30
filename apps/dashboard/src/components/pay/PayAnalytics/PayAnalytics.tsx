import {
  getUniversalBridgeUsage,
  getUniversalBridgeWalletUsage,
} from "@/api/analytics";
import type { ThirdwebClient } from "thirdweb";
import type { Range } from "../../analytics/date-range-selector";
import { PayEmbedFTUX } from "./PayEmbedFTUX";
import { PayCustomersTable } from "./components/PayCustomersTable";
import { PayNewCustomers } from "./components/PayNewCustomers";
import { PaymentHistory } from "./components/PaymentHistory";
import { PaymentsSuccessRate } from "./components/PaymentsSuccessRate";
import { Payouts } from "./components/Payouts";
import { TotalPayVolume } from "./components/TotalPayVolume";
import { TotalVolumePieChart } from "./components/TotalVolumePieChart";

export async function PayAnalytics(props: {
  projectClientId: string;
  client: ThirdwebClient;
  projectId: string;
  teamId: string;
  range: Range;
  interval: "day" | "week";
}) {
  const { projectId, teamId, range, interval } = props;

  const dateFormat =
    interval === "day"
      ? { month: "short" as const, day: "numeric" as const }
      : {
          month: "short" as const,
          day: "numeric" as const,
        };

  const volumeDataPromise = getUniversalBridgeUsage({
    teamId: teamId,
    projectId: projectId,
    from: range.from,
    to: range.to,
    period: interval,
  }).catch((error) => {
    console.error(error);
    return [];
  });
  const walletDataPromise = getUniversalBridgeWalletUsage({
    teamId: teamId,
    projectId: projectId,
    from: range.from,
    to: range.to,
    period: interval,
  }).catch((error) => {
    console.error(error);
    return [];
  });

  const [volumeData, walletData] = await Promise.all([
    volumeDataPromise,
    walletDataPromise,
  ]);

  const hasVolume = volumeData.some((d) => d.amountUsdCents > 0);
  const hasWallet = walletData.some((d) => d.count > 0);
  if (!hasVolume && !hasWallet) {
    return <PayEmbedFTUX clientId={props.projectClientId} />;
  }

  return (
    <div className="flex flex-col gap-10 lg:gap-6">
      <GridWithSeparator>
        <div className="flex items-center border-border border-b pb-6 xl:border-none xl:pb-0">
          <TotalVolumePieChart
            data={volumeData?.filter((x) => x.status === "completed") || []}
          />
        </div>
        <TotalPayVolume
          data={volumeData?.filter((x) => x.status === "completed") || []}
          dateFormat={dateFormat}
        />
      </GridWithSeparator>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <CardContainer>
          <Payouts
            data={volumeData?.filter((x) => x.status === "completed") || []}
            dateFormat={dateFormat}
          />
        </CardContainer>
        <CardContainer>
          <PaymentsSuccessRate data={volumeData || []} />
        </CardContainer>
      </div>

      <GridWithSeparator>
        <div className="border-border border-b pb-6 xl:border-none xl:pb-0">
          <PayNewCustomers data={walletData || []} dateFormat={dateFormat} />
        </div>
        <PayCustomersTable data={walletData || []} client={props.client} />
      </GridWithSeparator>
      <CardContainer>
        <PaymentHistory
          client={props.client}
          teamId={props.teamId}
          projectClientId={props.projectClientId}
        />
      </CardContainer>
    </div>
  );
}

function GridWithSeparator(props: { children: React.ReactNode }) {
  return (
    <div className="relative grid grid-cols-1 gap-6 rounded-xl border border-border bg-card p-4 lg:gap-12 xl:grid-cols-2 xl:p-6">
      {props.children}
      {/* Desktop - horizontal middle */}
      <div className="absolute top-6 bottom-6 left-[50%] hidden w-[1px] bg-border xl:block" />
    </div>
  );
}

function CardContainer(props: { children: React.ReactNode }) {
  return (
    <div className="flex rounded-xl border border-border bg-card p-4 xl:p-6">
      {props.children}
    </div>
  );
}
