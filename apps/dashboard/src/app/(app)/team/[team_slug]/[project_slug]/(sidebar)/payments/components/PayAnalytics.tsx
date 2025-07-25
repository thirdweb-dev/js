import { ResponsiveSuspense } from "responsive-rsc";
import type { ThirdwebClient } from "thirdweb";
import {
  getUniversalBridgeUsage,
  getUniversalBridgeWalletUsage,
} from "@/api/analytics";
import type { Range } from "@/components/analytics/date-range-selector";
import { Card } from "@/components/ui/card";
import { CodeServer } from "@/components/ui/code/code.server";
import { Skeleton } from "@/components/ui/skeleton";
import { BuyWidgetFTUX } from "./BuyWidgetFTUX";
import { apiCode, embedCode, sdkCode } from "./code-examples";
import { PayAnalyticsFilter } from "./PayAnalyticsFilter";
import { PayCustomersTable } from "./PayCustomersTable";
import { PaymentHistory } from "./PaymentHistory.client";
import { PaymentsSuccessRate } from "./PaymentsSuccessRate";
import { PayNewCustomers } from "./PayNewCustomers";
import { Payouts } from "./Payouts";
import { TotalPayVolume } from "./TotalPayVolume";
import { TotalVolumePieChart } from "./TotalVolumePieChart";

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
      ? { day: "numeric" as const, month: "short" as const }
      : {
          day: "numeric" as const,
          month: "short" as const,
        };

  const volumeDataPromise = getUniversalBridgeUsage({
    from: range.from,
    period: interval,
    projectId: projectId,
    teamId: teamId,
    to: range.to,
  }).catch((error) => {
    console.error(error);
    return [];
  });
  const walletDataPromise = getUniversalBridgeWalletUsage({
    from: range.from,
    period: interval,
    projectId: projectId,
    teamId: teamId,
    to: range.to,
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
    return (
      <BuyWidgetFTUX
        clientId={props.projectClientId}
        codeExamples={
          {
            api: (
              <CodeServer
                className="bg-background"
                code={apiCode(props.projectClientId)}
                lang="bash"
              />
            ),
            embed: (
              <CodeServer
                className="bg-background"
                code={embedCode(props.projectClientId)}
                lang="tsx"
              />
            ),
            sdk: (
              <CodeServer
                className="bg-background"
                code={sdkCode(props.projectClientId)}
                lang="ts"
              />
            ),
          } as const
        }
      />
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-start">
        <PayAnalyticsFilter />
      </div>
      <ResponsiveSuspense
        fallback={
          <div className="flex flex-col gap-6">
            <Skeleton className="h-[350px] border rounded-xl" />
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <Skeleton className="h-[350px] border rounded-xl" />
              <Skeleton className="h-[350px] border rounded-xl" />
            </div>
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <Skeleton className="h-[350px] border rounded-xl" />
              <Skeleton className="h-[350px] border rounded-xl" />
            </div>
            <Skeleton className="h-[500px] border rounded-xl" />
          </div>
        }
        searchParamsUsed={["from", "to", "interval"]}
      >
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
              <PayNewCustomers
                data={walletData || []}
                dateFormat={dateFormat}
              />
            </div>
            <PayCustomersTable client={props.client} data={walletData || []} />
          </GridWithSeparator>
          <PaymentHistory
            client={props.client}
            projectClientId={props.projectClientId}
            teamId={props.teamId}
          />
        </div>
      </ResponsiveSuspense>
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
  return <Card className="flex p-4 lg:p-6">{props.children}</Card>;
}
