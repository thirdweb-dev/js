import { getLastNDaysRange } from "../../analytics/date-range-selector";
import { Payouts } from "./components/Payouts";
import { TotalPayVolume } from "./components/TotalPayVolume";
import { TotalVolumePieChart } from "./components/TotalVolumePieChart";
import { PaymentsSuccessRate } from "./components/PaymentsSuccessRate";
import { PayNewCustomers } from "./components/PayNewCustomers";
import { PayCustomersTable } from "./components/PayCustomersTable";
import {
  getUniversalBridgeUsage,
  getUniversalBridgeWalletUsage,
} from "@/api/analytics";
import { useMemo } from "react";

export async function PayAnalytics(props: {
  // switching to projectId for lookup, but have to send both during migration
  projectId: string;
  teamId: string;
}) {
  const projectId = props.projectId;
  const teamId = props.teamId;
  const range = getLastNDaysRange("last-120");
  const numberOfDays = Math.round(
    (range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24),
  );
  const [period, dateFormat]: [
    "day" | "week" | "month",
    {
      month: "short" | "long";
      day?: "numeric" | "2-digit";
    },
  ] = useMemo(() => {
    if (numberOfDays > 90) {
      return ["month", { month: "short" }];
    }
    if (numberOfDays > 30) {
      return ["week", { month: "short", day: "numeric" }];
    }
    return ["day", { month: "short", day: "numeric" }];
  }, [numberOfDays]);

  const volumeData = await getUniversalBridgeUsage({
    teamId: teamId,
    projectId: projectId,
    from: range.from,
    to: range.to,
    period,
  }).catch((error) => {
    console.error(error);
    return [];
  });
  const walletData = await getUniversalBridgeWalletUsage({
    teamId: teamId,
    projectId: projectId,
    from: range.from,
    to: range.to,
    period,
  }).catch((error) => {
    console.error(error);
    return [];
  });
  console.log(walletData);

  return (
    <div>
      <div className="mb-4 flex">
        {/* <DateRangeSelector range={range} setRange={() => {}} /> */}
      </div>
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
          <PayCustomersTable data={walletData || []} />
        </GridWithSeparator>
        {/*
        <CardContainer>
          <PaymentHistory
            clientId={clientId}
            projectId={projectId}
            teamId={teamId}
            from={range.from}
            to={range.to}
          />
        </CardContainer>
         */}
      </div>
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
