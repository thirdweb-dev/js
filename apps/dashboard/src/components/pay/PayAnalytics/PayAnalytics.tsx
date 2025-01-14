"use client";

import { useState } from "react";
import {
  DateRangeSelector,
  type Range,
  getLastNDaysRange,
} from "../../analytics/date-range-selector";
import { PayCustomersTable } from "./components/PayCustomersTable";
import { PayNewCustomers } from "./components/PayNewCustomers";
import { PaymentHistory } from "./components/PaymentHistory";
import { PaymentsSuccessRate } from "./components/PaymentsSuccessRate";
import { Payouts } from "./components/Payouts";
import { TotalPayVolume } from "./components/TotalPayVolume";
import { TotalVolumePieChart } from "./components/TotalVolumePieChart";

export function PayAnalytics(props: { clientId: string }) {
  const clientId = props.clientId;
  const [range, setRange] = useState<Range>(() =>
    getLastNDaysRange("last-120"),
  );

  const numberOfDays = Math.round(
    (range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24),
  );

  return (
    <div>
      <div className="mb-4 flex">
        <DateRangeSelector range={range} setRange={setRange} />
      </div>
      <div className="flex flex-col gap-10 lg:gap-4">
        <GridWithSeparator>
          <div className="flex items-center border-border border-b pb-6 xl:border-none xl:pb-0">
            <TotalVolumePieChart
              clientId={clientId}
              from={range.from}
              to={range.to}
            />
          </div>
          <TotalPayVolume
            clientId={clientId}
            from={range.from}
            to={range.to}
            numberOfDays={numberOfDays}
          />
        </GridWithSeparator>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 ">
          <CardContainer>
            <Payouts
              clientId={clientId}
              from={range.from}
              to={range.to}
              numberOfDays={numberOfDays}
            />
          </CardContainer>
          <CardContainer>
            <PaymentsSuccessRate
              clientId={clientId}
              from={range.from}
              to={range.to}
            />
          </CardContainer>
        </div>

        <GridWithSeparator>
          <div className="border-border border-b pb-6 xl:border-none xl:pb-0">
            <PayNewCustomers
              clientId={clientId}
              from={range.from}
              to={range.to}
              numberOfDays={numberOfDays}
            />
          </div>
          <PayCustomersTable
            clientId={clientId}
            from={range.from}
            to={range.to}
          />
        </GridWithSeparator>

        <CardContainer>
          <PaymentHistory clientId={clientId} from={range.from} to={range.to} />
        </CardContainer>
      </div>
    </div>
  );
}

function GridWithSeparator(props: { children: React.ReactNode }) {
  return (
    <div className="relative grid grid-cols-1 gap-6 rounded-xl border border-border p-4 lg:gap-12 xl:grid-cols-2 xl:p-6">
      {props.children}
      {/* Desktop - horizontal middle */}
      <div className="absolute top-6 bottom-6 left-[50%] hidden w-[1px] bg-border xl:block" />
    </div>
  );
}

function CardContainer(props: { children: React.ReactNode }) {
  return (
    <div className="flex rounded-xl border border-border p-4 xl:p-6">
      {props.children}
    </div>
  );
}
