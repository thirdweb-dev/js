import type { LocaleId } from "../../../ui/types.js";
import type { InjectedWalletLocale } from "./types.js";

/**
 * @internal
 */
export async function getInjectedWalletLocale(
  locale: LocaleId,
): Promise<(walletName: string) => InjectedWalletLocale> {
  if (locale === "ja-JP") {
    return (await import("./ja.js")).default;
  } else if (locale === "es-419") {
    return (await import("./es.js")).default;
  } else if (locale === "tl_PH") {
    return (await import("./tl.js")).default;
  }

  return (await import("./en.js")).default;
}
