import { transform } from "typedoc-better-json";

let prom: Promise<ReturnType<typeof transform>> | null = null;
export async function fetchWalletsDoc() {
  if (prom) {
    return prom;
  }
  prom = (async () => {
    const doc = await import(
      "../../../../../../../../legacy_packages/wallets/typedoc/documentation.json"
    );

    return transform(doc as any);
  })();
  return prom;
}
