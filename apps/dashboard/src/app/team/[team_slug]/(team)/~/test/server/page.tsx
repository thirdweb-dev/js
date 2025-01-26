import { pageProcessing } from "../_common/pageProcessing";
import { RangeSelector } from "./client";
import { RSCChart } from "./server";

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
