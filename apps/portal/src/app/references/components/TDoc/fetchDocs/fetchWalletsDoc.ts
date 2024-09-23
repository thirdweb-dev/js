import { transform } from "typedoc-better-json";

let prom: Promise<ReturnType<typeof transform>> | null = null;
export async function fetchWalletsDoc() {
  if (prom) {
    return prom;
  }
  prom = (async () => {
    const doc = await import("./v4-legacy-docs/wallets.json");

    // @ts-expect-error - works fine!
    return transform(doc);
  })();
  return prom;
}
