import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { getToken } from "../../../../../pay/convert/get-token.js";
import type { Wallet } from "../../../../../wallets/interfaces/wallet.js";
import { useActiveAccount } from "../../../../core/hooks/wallets/useActiveAccount.js";
import { useActiveWallet } from "../../../../core/hooks/wallets/useActiveWallet.js";
import { useActiveWalletChain } from "../../../../core/hooks/wallets/useActiveWalletChain.js";
import type { ActiveWalletInfo, TokenSelection } from "./types.js";

export function useActiveWalletInfo(
  activeWalletOverride?: Wallet,
): ActiveWalletInfo | undefined {
  const activeAccount = useActiveAccount();
  const activeWallet = useActiveWallet();
  const activeChain = useActiveWalletChain();

  return useMemo(() => {
    const wallet = activeWalletOverride || activeWallet;
    const chain = activeWalletOverride?.getChain() || activeChain;
    const account = activeWalletOverride?.getAccount() || activeAccount;
    return wallet && chain && account
      ? {
          activeChain: chain,
          activeWallet: wallet,
          activeAccount: account,
        }
      : undefined;
  }, [activeAccount, activeWallet, activeChain, activeWalletOverride]);
}

export function useTokenPrice(options: {
  token: TokenSelection | undefined;
  client: ThirdwebClient;
}) {
  return useQuery({
    queryKey: ["token-price", options.token],
    enabled: !!options.token,
    queryFn: () => {
      if (!options.token) {
        throw new Error("Token is required");
      }
      return getToken(
        options.client,
        options.token.tokenAddress,
        options.token.chainId,
      );
    },
    refetchOnMount: false,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
