import type { InAppWalletLocale } from "./locale/types.js";
import { getInAppWalletLocale } from "./locale/getEmbeddedWalletLocale.js";
import { useWalletConnectionCtx } from "../../../core/hooks/others/useWalletConnectionCtx.js";
import { useEffect, useState } from "react";

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
  }, [locale, localeId]);

  return locale;
}
