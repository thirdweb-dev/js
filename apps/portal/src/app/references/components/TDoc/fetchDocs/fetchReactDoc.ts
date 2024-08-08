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
      import(
        "../../../../../../../../legacy_packages/react/typedoc/documentation.json"
      ),
      fetchReactCoreDoc(),
    ]);
    return mergeDocs(reactCoreDoc, transform(doc as any));
  })();
  return prom;
}
