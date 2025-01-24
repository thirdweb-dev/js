import { simulatePageProcessingDelay } from "./delays";
import { getRange } from "./getRange";

export async function pageProcessing(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const fromStr = searchParams.from;
  const toStr = searchParams.to;

  await simulatePageProcessingDelay();

  const range = getRange({
    from: typeof fromStr === "string" ? fromStr : undefined,
    to: typeof toStr === "string" ? toStr : undefined,
  });

  return range;
}
