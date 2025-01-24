import { transform } from "typedoc-better-json";

let v5Prom: Promise<ReturnType<typeof transform>> | null = null;

export async function fetchTypeScriptDoc() {
  // v5 case (default)
  if (v5Prom) {
    return v5Prom;
  }
  v5Prom = (async () => {
    const doc = await import(
      "../../../../../../../../packages/thirdweb/typedoc/documentation.json"
    );

    // @ts-expect-error - works fine!
    return transform(doc);
  })();
  return v5Prom;
}
