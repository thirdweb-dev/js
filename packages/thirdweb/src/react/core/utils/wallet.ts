import { useQuery } from "@tanstack/react-query";
import { ethereum } from "../../../chains/chain-definitions/ethereum.js";
import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { resolveAvatar } from "../../../extensions/ens/resolve-avatar.js";
import { resolveName } from "../../../extensions/ens/resolve-name.js";
import { getWalletInfo } from "../../../wallets/__generated__/getWalletInfo.js";
import type { Account, Wallet } from "../../../wallets/interfaces/wallet.js";
import type { WalletInfo } from "../../../wallets/wallet-info.js";
import type { WalletId } from "../../../wallets/wallet-types.js";
import { useWalletBalance } from "../hooks/others/useWalletBalance.js";
import { shortenString } from "./addresses.js";

/**
 * Get the ENS name and avatar for an address
 * @param options - the client and address to get the ENS name and avatar for
 * @returns - a query object that resolves to the ENS name
 * @example
 * ```tsx
 * import { useEnsName } from "thirdweb/react";
 *
 * const { data: ensName } = useEnsName({
 *  client,
 *  address: "0x1234...",
 * });
 * ```
 * @extension ENS
 */
export function useEnsName(options: {
  client: ThirdwebClient;
  address: string | undefined;
}) {
  const { client, address } = options;
  return useQuery({
    queryKey: ["ens-name", address],
    enabled: !!address,
    queryFn: () =>
      resolveName({
        client,
        address: address || "",
        resolverChain: ethereum,
      }),
  });
}

/**
 * Get the ENS avatar for an ENS name
 * @param options - the client and ENS name to get the avatar for
 * @returns - a query object that resolves to the avatar
 * @example
 * ```tsx
 * import { useEnsAvatar } from "thirdweb/react";
 *
 * const { data: ensAvatar } = useEnsAvatar({
 *  client,
 *  ensName: "my-ens-name.eth",
 * });
 * ```
 * @extension ENS
 */
export function useEnsAvatar(options: {
  client: ThirdwebClient;
  ensName: string | null | undefined;
}) {
  const { client, ensName } = options;
  return useQuery({
    queryKey: ["ens-avatar", ensName],
    enabled: !!ensName,
    queryFn: async () =>
      resolveAvatar({
        client,
        name: ensName || "",
      }),
  });
}

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

  const ensNameQuery = useEnsName({
    client,
    address: activeAccount?.address,
  });

  const ensAvatarQuery = useEnsAvatar({
    client,
    ensName: ensNameQuery.data,
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
 *
 * @example
 * ```tsx
 * import { useWalletInfo } from "thirdweb/react";
 *
 * const { data: walletInfo } = useWalletInfo("io.metamask");
 * console.log("Walelt name", walletInfo?.name);
 * ```
 * @wallet
 */
export function useWalletInfo(id: WalletId | undefined) {
  return useQuery<WalletInfo>({
    queryKey: ["wallet-info", id],
    queryFn: () => {
      if (!id) {
        throw new Error("Wallet id is required");
      }
      return getWalletInfo(id, false);
    },
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: !!id,
  });
}

/**
 * Returns the wallet icon for the provided wallet id.
 *
 * @example
 * ```tsx
 * import { useWalletImage } from "thirdweb/react";
 *
 * const { data: walletImage } = useWalletImage("io.metamask");
 *
 * return <img src={walletImage} alt="MetaMask logo" />;
 * ```
 *
 * @wallet
 */
export function useWalletImage(id: WalletId | undefined) {
  return useQuery({
    queryKey: ["wallet-image", id],
    queryFn: () => {
      if (!id) {
        throw new Error("Wallet id is required");
      }
      return getWalletInfo(id, true);
    },
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: !!id,
  });
}

/**
 * @internal
 */
export function hasSponsoredTransactionsEnabled(wallet: Wallet | undefined) {
  if (!wallet) {
    return false;
  }
  let sponsoredTransactionsEnabled = false;
  if (wallet && wallet.id === "smart") {
    const options = (wallet as Wallet<"smart">).getConfig();
    if ("sponsorGas" in options) {
      sponsoredTransactionsEnabled = options.sponsorGas;
    }
    if ("gasless" in options) {
      sponsoredTransactionsEnabled = options.gasless;
    }
  }
  if (wallet && wallet.id === "inApp") {
    const options = (wallet as Wallet<"inApp">).getConfig();
    if (options && "smartAccount" in options && options.smartAccount) {
      const smartOptions = options.smartAccount;
      if ("sponsorGas" in smartOptions) {
        sponsoredTransactionsEnabled = smartOptions.sponsorGas;
      }
      if ("gasless" in smartOptions) {
        sponsoredTransactionsEnabled = smartOptions.gasless;
      }
    }
  }
  return sponsoredTransactionsEnabled;
}
