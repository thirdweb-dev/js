import { useEffect, useState } from "react";
import type { LocaleId } from "../../ui/types.js";
import { getInAppWalletLocale } from "../shared/locale/getConnectLocale.js";
import type { InAppWalletLocale } from "../shared/locale/types.js";

/**
 * @internal
 */
export function useInAppWalletLocale(localeId: LocaleId) {
  const [locale, setLocale] = useState<InAppWalletLocale | undefined>(
    undefined,
  );

  // TODO: move this to a useQuery hook
  // or at the very least dedupe it?
  useEffect(() => {
    getInAppWalletLocale(localeId).then((l) => {
      setLocale(l);
    });
  }, [localeId]);

  return locale;
}
