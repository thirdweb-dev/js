import { unstable_cache } from "next/cache";
import { Suspense } from "react";
import { ChartUI } from "../_common/ChartUI";
import { fetchTestData } from "../_common/fetchTestData";
import { QueryChartUI } from "./client";

const cachedFetchTestData = unstable_cache(fetchTestData, ["fetchTestData"], {
  // 1 hour
  revalidate: 3600,
});

export function RSCQueryChart(props: {
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
  const data = await cachedFetchTestData(props.range);
  return <QueryChartUI initialData={data} />;
}
