import { useEffect, useState } from "react";
import { useConnectUI } from "../../../core/hooks/others/useWalletConnectionCtx.js";
import { getConnectLocale } from "../shared/locale/getConnectLocale.js";
import type { ConnectLocale } from "../shared/locale/types.js";

/**
 * @internal
 */
export function useConnectLocale() {
  const localeId = useConnectUI().locale;
  const [locale, setLocale] = useState<ConnectLocale | undefined>(undefined);

  useEffect(() => {
    getConnectLocale(localeId).then((l) => {
      setLocale(l);
    });
  }, [localeId]);

  return locale;
}
