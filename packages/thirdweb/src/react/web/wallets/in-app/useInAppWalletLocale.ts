import { useQuery } from "@tanstack/react-query";
import { useConnectUI } from "../../../core/hooks/others/useWalletConnectionCtx.js";
import { getInAppWalletLocale } from "./locale/getInAppWalletLocale.js";

/**
 * @internal
 */
export function useInAppWalletLocale() {
  const localeId = useConnectUI().locale;
  return useQuery({
    queryKey: ["inAppWalletLocale", localeId],
    queryFn: () => getInAppWalletLocale(localeId),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
