import { transform } from "typedoc-better-json";

let v5Prom: Promise<ReturnType<typeof transform>> | null = null;
type TransformArg = Parameters<typeof transform>[0];

export async function fetchTypeScriptDoc() {
  // v5 case (default)
  if (v5Prom) {
    return v5Prom;
  }
  v5Prom = (async () => {
    const doc = await import(
      "../../../../../../../../packages/thirdweb/typedoc/documentation.json"
    );

    return transform(doc.default as TransformArg);
  })();
  return v5Prom;
}
