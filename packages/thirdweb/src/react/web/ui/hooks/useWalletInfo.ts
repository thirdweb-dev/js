import { useQuery } from "@tanstack/react-query";
import { getWalletInfo } from "../../../../wallets/__generated__/getWalletInfo.js";

/**
 * @internal
 */
export function useWalletInfo(id: string) {
  return useQuery({
    queryKey: ["wallet-info", id],
    queryFn: () => {
      return getWalletInfo(id);
    },
    retry: false,
  });
}

/**
 * @internal
 */
export function useWalletImage(id: string) {
  return useQuery({
    queryKey: ["wallet-image", id],
    queryFn: () => {
      return getWalletInfo(id, true);
    },
    retry: false,
  });
}
