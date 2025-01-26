import { ChartUI } from "../_common/ChartUI";
import { simulatePageProcessingDelay } from "../_common/delays";
import { RangeSelector } from "./client";
import {
  ResponsiveSearchParamsProvider,
  ResponsiveSuspense,
} from "./responsive";
import { AsyncChartUI } from "./server";

export default async function Page(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await simulatePageProcessingDelay();

  const searchParams = await props.searchParams;
  const fromStr =
    typeof searchParams.from === "string" ? searchParams.from : undefined;
  const toStr =
    typeof searchParams.to === "string" ? searchParams.to : undefined;

  return (
    <ResponsiveSearchParamsProvider
      value={{
        from: fromStr,
        to: toStr,
      }}
    >
      <div>
        <RangeSelector />
        <div className="h-8" />

        <ResponsiveSuspense
          searchParamsUsed={["from", "to"]}
          fallback={<ChartUI data={[]} isPending={true} />}
        >
          <AsyncChartUI from={fromStr} to={toStr} />
        </ResponsiveSuspense>
      </div>
    </ResponsiveSearchParamsProvider>
  );
}
