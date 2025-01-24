import {
  ResponsiveSearchParamsProvider,
  ResponsiveSuspense,
} from "responsive-rsc";
import { ChartUI } from "../_common/ChartUI";
import { simulatePageProcessingDelay } from "../_common/delays";
import { getCachedFetchTestData } from "../_common/getCachedFetchTestData";
import { getRange } from "../_common/getRange";
import { RangeSelector } from "./range-selector";

export default async function Page(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await simulatePageProcessingDelay();

  const searchParams = await props.searchParams;
  const from =
    typeof searchParams.from === "string" ? searchParams.from : undefined;
  const to = typeof searchParams.to === "string" ? searchParams.to : undefined;

  return (
    <ResponsiveSearchParamsProvider
      value={{
        from: from,
        to: to,
      }}
    >
      <div>
        <RangeSelector />
        <div className="h-8" />

        <ResponsiveSuspense
          searchParamsUsed={["from", "to"]}
          fallback={<ChartUI data={[]} isPending={true} />}
        >
          <AsyncChartUI from={from} to={to} />
        </ResponsiveSuspense>
      </div>
    </ResponsiveSearchParamsProvider>
  );
}

export async function AsyncChartUI(props: {
  from: string | undefined;
  to: string | undefined;
}) {
  const range = getRange(props);
  const data = await getCachedFetchTestData(range);
  return <ChartUI data={data} isPending={false} />;
}
