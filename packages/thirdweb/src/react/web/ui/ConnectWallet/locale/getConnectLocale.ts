import { useQuery } from "@tanstack/react-query";
import type { LocaleId } from "../../types.js";

export async function getConnectLocale(localeId: LocaleId) {
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
    case "vi_VN": {
      return (await import("./vi.js")).default;
    }
    case "de_DE": {
      return (await import("./de.js")).default;
    }
    case "ko_KR": {
      return (await import("./kr.js")).default;
    }
    case "fr_FR": {
      return (await import("./fr.js")).default;
    }
    case "ru_RU": {
      return (await import("./ru.js")).default;
    }
    case "pt_BR": {
      return (await import("./br.js")).default;
    }
    default: {
      return (await import("./en.js")).default;
    }
  }
}

/**
 * @internal
 */
export function useConnectLocale(localeId: LocaleId) {
  return useQuery({
    queryFn: async () => {
      return getConnectLocale(localeId);
    },
    queryKey: ["connect-locale", localeId],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
