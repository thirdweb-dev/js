import { Suspense } from "react";
import { ChartUI } from "../_common/ChartUI";
import { getCachedFetchTestData } from "../_common/getCachedFetchTestData";
import { pageProcessing } from "../_common/pageProcessing";
import { RangeSelector } from "./range-selector";

export default async function Page(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const range = await pageProcessing(props);

  return (
    <div>
      <RangeSelector range={range} />
      <div className="h-8" />
      <RSCChart
        range={{
          from: range.from,
          to: range.to,
        }}
      />
    </div>
  );
}

function RSCChart(props: {
  range: {
    from: Date;
    to: Date;
  };
}) {
  return (
    <Suspense
      key={props.range.from.toDateString() + props.range.to.toDateString()}
      fallback={<ChartUI data={[]} isPending={true} />}
    >
      <AsyncChartUI range={props.range} />
    </Suspense>
  );
}

async function AsyncChartUI(props: {
  range: {
    from: Date;
    to: Date;
  };
}) {
  const data = await getCachedFetchTestData(props.range);
  return <ChartUI data={data} isPending={false} />;
}
