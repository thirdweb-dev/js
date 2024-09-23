import { transform } from "typedoc-better-json";

let prom: Promise<ReturnType<typeof transform>> | null = null;
export async function fetchStorageDoc() {
  if (prom) {
    return prom;
  }
  prom = (async () => {
    const doc = await import("./v4-legacy-docs/storage.json");

    // @ts-expect-error - works fine!
    return transform(doc);
  })();
  return prom;
}
