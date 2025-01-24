import { unstable_cache } from "next/cache";
import { ChartUI } from "../_common/ChartUI";
import { fetchTestData } from "../_common/fetchTestData";
import { getRange } from "../_common/getRange";

const cachedFetchTestData = unstable_cache(fetchTestData, ["fetchTestData"], {
  // 1 hour
  revalidate: 3600,
});

export async function AsyncChartUI(props: {
  from: string | undefined;
  to: string | undefined;
}) {
  const range = getRange(props);
  const data = await cachedFetchTestData(range);
  return <ChartUI data={data} isPending={false} />;
}
