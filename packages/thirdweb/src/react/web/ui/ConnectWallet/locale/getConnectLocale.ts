import type { LocaleId } from "../../types.js";
import type { ConnectLocale } from "./types.js";

/**
 * @internal
 */
export async function getConnectLocale(
  localeId: LocaleId,
): Promise<ConnectLocale> {
  switch (localeId) {
    case "es_ES": {
      return (await import("./es.js")).default;
    }
    case "ja_JP": {
      return (await import("./ja.js")).default;
    }
    case "tl_PH": {
      return (await import("./tl.js")).default;
    }
    default: {
      return (await import("./en.js")).default;
    }
  }
}
