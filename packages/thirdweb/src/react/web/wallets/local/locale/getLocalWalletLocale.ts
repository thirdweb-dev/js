import type { LocaleId } from "../../../ui/types.js";
import type { LocalWalletLocale } from "./types.js";

/**
 * @internal
 */
export async function getLocalWalletLocale(
  locale: LocaleId,
): Promise<LocalWalletLocale> {
  if (locale === "ja-JP") {
    return (await import("./ja.js")).default;
  } else if (locale === "es-419") {
    return (await import("./es.js")).default;
  } else if (locale === "tl_PH") {
    return (await import("./tl.js")).default;
  }

  return (await import("./en.js")).default;
}
