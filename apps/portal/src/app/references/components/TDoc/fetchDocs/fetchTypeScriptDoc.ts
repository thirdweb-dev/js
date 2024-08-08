import { transform } from "typedoc-better-json";

let v4Prom: Promise<ReturnType<typeof transform>> | null = null;
let v5Prom: Promise<ReturnType<typeof transform>> | null = null;
export async function fetchTypeScriptDoc(version: string) {
  // v4 case
  if (version === "v4") {
    if (v4Prom) {
      return v4Prom;
    }
    v4Prom = (async () => {
      const doc = await import(
        "../../../../../../../../legacy_packages/sdk/typedoc/documentation.json"
      );

      return transform(doc as any);
    })();
    return v4Prom;
  }
  // v5 case (default)
  if (v5Prom) {
    return v5Prom;
  }
  v5Prom = (async () => {
    const doc = await import(
      "../../../../../../../../packages/thirdweb/typedoc/documentation.json"
    );

    return transform(doc as any);
  })();
  return v5Prom;
}
