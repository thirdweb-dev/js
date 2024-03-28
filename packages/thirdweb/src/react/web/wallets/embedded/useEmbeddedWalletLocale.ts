import type { EmbeddedWalletLocale } from "./locale/types.js";
import { getEmbeddedWalletLocale } from "./locale/getEmbeddedWalletLocale.js";
import { useWalletConnectionCtx } from "../../../core/hooks/others/useWalletConnectionCtx.js";
import { useEffect, useState } from "react";

/**
 * @internal
 */
export function useEmbeddedWalletLocale() {
  const localeId = useWalletConnectionCtx().locale;
  const [locale, setLocale] = useState<EmbeddedWalletLocale | undefined>(
    undefined,
  );

  useEffect(() => {
    getEmbeddedWalletLocale(localeId).then((l) => {
      setLocale(l);
    });
  }, [locale, localeId]);

  return locale;
}
