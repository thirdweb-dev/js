import type { LocaleId } from "../../../ui/types.js";
import type { SmartWalletLocale } from "./types.js";

/**
 * @internal
 */
export async function getSmartWalletLocale(
  localeId: LocaleId,
): Promise<SmartWalletLocale> {
  switch (localeId) {
    case "es_ES":
      return (await import("./es.js")).default;
    case "ja_JP":
      return (await import("./ja.js")).default;
    case "tl_PH":
      return (await import("./tl.js")).default;
    default:
      return (await import("./en.js")).default;
  }
}
