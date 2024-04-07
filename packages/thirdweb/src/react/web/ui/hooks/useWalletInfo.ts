import { useQuery } from "@tanstack/react-query";
import { getWalletInfo } from "../../../../wallets/__generated__/getWalletInfo.js";
import type { WalletInfo } from "../../../../wallets/wallet-info.js";
import type { WalletId } from "../../../../wallets/wallet-types.js";

/**
 * @internal
 */
export function useWalletInfo(id: WalletId) {
  return useQuery<WalletInfo>({
    queryKey: ["wallet-info", id],
    queryFn: () => {
      return getWalletInfo(id, false);
    },
    retry: false,
  });
}

/**
 * @internal
 */
export function useWalletImage(id: WalletId) {
  return useQuery({
    queryKey: ["wallet-image", id],
    queryFn: () => {
      return getWalletInfo(id, true);
    },
    retry: false,
  });
}
