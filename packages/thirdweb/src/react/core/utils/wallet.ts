import { useQuery } from "@tanstack/react-query";
import { ethereum } from "../../../chains/chain-definitions/ethereum.js";
import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { resolveAvatar } from "../../../extensions/ens/resolve-avatar.js";
import { resolveName } from "../../../extensions/ens/resolve-name.js";
import { getWalletInfo } from "../../../wallets/__generated__/getWalletInfo.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import type { WalletInfo } from "../../../wallets/wallet-info.js";
import type { WalletId } from "../../../wallets/wallet-types.js";
import { useWalletBalance } from "../hooks/others/useWalletBalance.js";
import { shortenString } from "./addresses.js";

/**
 * @internal
 */
export function useConnectedWalletDetails(
  client: ThirdwebClient,
  walletChain: Chain | undefined,
  activeAccount: Account | undefined,
  displayBalanceToken?: Record<number, string>,
) {
  const tokenAddress =
    walletChain && displayBalanceToken
      ? displayBalanceToken[Number(walletChain.id)]
      : undefined;

  const ensNameQuery = useQuery({
    queryKey: ["ens-name", activeAccount?.address],
    enabled: !!activeAccount?.address,
    queryFn: () =>
      resolveName({
        client,
        address: activeAccount?.address || "",
        resolverChain: ethereum,
      }),
  });

  const ensAvatarQuery = useQuery({
    queryKey: ["ens-avatar", ensNameQuery.data],
    enabled: !!ensNameQuery.data,
    queryFn: async () =>
      resolveAvatar({
        client,
        name: ensNameQuery.data || "",
      }),
  });

  const shortAddress = activeAccount?.address
    ? shortenString(activeAccount.address, false)
    : "";

  const balanceQuery = useWalletBalance({
    chain: walletChain ? walletChain : undefined,
    tokenAddress,
    address: activeAccount?.address,
    client,
  });

  const addressOrENS = ensNameQuery.data || shortAddress;

  return {
    ensNameQuery,
    ensAvatarQuery,
    addressOrENS,
    shortAddress,
    balanceQuery,
  };
}

/**
 * Returns the wallet info for the provided wallet id.
 * @wallet
 */
export function useWalletInfo(id: WalletId) {
  return useQuery<WalletInfo>({
    queryKey: ["wallet-info", id],
    queryFn: () => {
      return getWalletInfo(id, false);
    },
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

/**
 * Returns the wallet image for the provided wallet id.
 * @wallet
 */
export function useWalletImage(id: WalletId) {
  return useQuery({
    queryKey: ["wallet-image", id],
    queryFn: () => {
      return getWalletInfo(id, true);
    },
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
