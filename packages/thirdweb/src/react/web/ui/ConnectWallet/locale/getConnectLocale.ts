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
    queryKey: ["connect-locale", localeId],
    queryFn: async () => {
      return getConnectLocale(localeId);
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
