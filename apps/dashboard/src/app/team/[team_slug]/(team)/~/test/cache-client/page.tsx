import { pageProcessing } from "../_common/pageProcessing";
import { RangeSelector } from "./client";
import { RangeProvider } from "./contexts";
import { RSCQueryChart } from "./server";

export default async function Page(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const range = await pageProcessing(props);

  return (
    <RangeProvider value={range}>
      <div>
        <RangeSelector />
        <div className="h-8" />
        <RSCQueryChart
          range={{
            from: range.from,
            to: range.to,
          }}
        />
      </div>
    </RangeProvider>
  );
}
