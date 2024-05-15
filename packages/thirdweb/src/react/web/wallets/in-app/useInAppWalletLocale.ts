import { useEffect, useState } from "react";
import { useConnectUI } from "../../../core/hooks/others/useWalletConnectionCtx.js";
import { getInAppWalletLocale } from "./locale/getInAppWalletLocale.js";
import type { InAppWalletLocale } from "./locale/types.js";

/**
 * @internal
 */
export function useInAppWalletLocale() {
  const localeId = useConnectUI().locale;
  const [locale, setLocale] = useState<InAppWalletLocale | undefined>(
    undefined,
  );

  useEffect(() => {
    getInAppWalletLocale(localeId).then((l) => {
      setLocale(l);
    });
  }, [localeId]);

  return locale;
}
