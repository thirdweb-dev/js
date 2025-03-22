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
    case "vi_VN":
      return (await import("./vi.js")).default;
    case "de_DE":
      return (await import("./de.js")).default;
    case "ko_KR":
      return (await import("./kr.js")).default;
    case "fr_FR":
      return (await import("./fr.js")).default;
    case "ru_RU":
      return (await import("./ru.js")).default;
    case "pt_BR": {
      return (await import("./br.js")).default;
    }
    default:
      return (await import("./en.js")).default;
  }
}
