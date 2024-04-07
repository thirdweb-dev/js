import { useEffect, useState } from "react";
import { useWalletConnectionCtx } from "../../../core/hooks/others/useWalletConnectionCtx.js";
import { getInAppWalletLocale } from "./locale/getInAppWalletLocale.js";
import type { InAppWalletLocale } from "./locale/types.js";

/**
 * @internal
 */
export function useInAppWalletLocale() {
  const localeId = useWalletConnectionCtx().locale;
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
