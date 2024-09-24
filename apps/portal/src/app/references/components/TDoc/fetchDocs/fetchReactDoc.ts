import { transform } from "typedoc-better-json";
import { fetchReactCoreDoc } from "./fetchReactCoreDoc";
import { mergeDocs } from "./mergeDocs";

let prom: Promise<ReturnType<typeof transform>> | null = null;
export async function fetchReactDoc() {
  if (prom) {
    return prom;
  }
  prom = (async () => {
    const [doc, reactCoreDoc] = await Promise.all([
      import("./v4-legacy-docs/react.json"),
      fetchReactCoreDoc(),
    ]);
    // @ts-expect-error - works fine!
    return mergeDocs(reactCoreDoc, transform(doc));
  })();
  return prom;
}
