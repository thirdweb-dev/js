import type { Range } from "components/analytics/date-range-selector";
import { InAppWalletAnalytics } from "components/embedded-wallets/Analytics";

export default function Page({
  params,
  searchParams,
}: {
  params: { team_slug: string; project_slug: string };
  searchParams: {
    from?: string;
    to?: string;
    type?: string;
    interval?: string;
  };
}) {
  const range =
    searchParams.from && searchParams.to
      ? {
          type: searchParams.type ?? "last-120",
          from: new Date(searchParams.from),
          to: new Date(searchParams.to),
        }
      : undefined;

  const interval: "day" | "week" = ["day", "week"].includes(
    searchParams.interval ?? "",
  )
    ? (searchParams.interval as "day" | "week")
    : "week";
  return (
    <InAppWalletAnalytics
      clientId={params.project_slug}
      interval={interval}
      range={range as Range}
    />
  );
}
