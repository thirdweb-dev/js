import type { LocaleId } from "../../types.js";
import type { ConnectLocale } from "./types.js";

export async function getConnectLocale(
  localeId: LocaleId,
): Promise<ConnectLocale> {
  switch (localeId) {
    case "es-419": {
      return (await import("./es.js")).default;
    }
    case "ja-JP": {
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
