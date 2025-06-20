import { useQuery } from "@tanstack/react-query";
import { ethereum } from "../../../chains/chain-definitions/ethereum.js";
import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { resolveAvatar } from "../../../extensions/ens/resolve-avatar.js";
import { resolveName } from "../../../extensions/ens/resolve-name.js";
import { shortenAddress } from "../../../utils/address.js";
import { parseAvatarRecord } from "../../../utils/ens/avatar.js";
import { getWalletInfo } from "../../../wallets/__generated__/getWalletInfo.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import type { WalletInfo } from "../../../wallets/wallet-info.js";
import type { WalletId } from "../../../wallets/wallet-types.js";
import { useWalletBalance } from "../hooks/others/useWalletBalance.js";
import { useSocialProfiles } from "../social/useSocialProfiles.js";

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
    enabled: !!address,
    queryFn: () =>
      resolveName({
        address: address || "",
        client,
        resolverChain: ethereum,
      }),
    queryKey: ["ens-name", address],
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
    enabled: !!ensName,
    queryFn: async () =>
      resolveAvatar({
        client,
        name: ensName || "",
      }),
    queryKey: ["ens-avatar", ensName],
  });
}

/**
 * @internal This hook is only being used in our react-native package
 * It can be removed once we migrate the RN UI code to our headless components (AccountProvider, AccountName etc.)
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
    address: activeAccount?.address,
    client,
  });

  const ensAvatarQuery = useEnsAvatar({
    client,
    ensName: ensNameQuery.data,
  });

  const socialProfileQuery = useSocialProfiles({
    address: activeAccount?.address,
    client,
  });

  const shortAddress = activeAccount?.address
    ? shortenAddress(activeAccount.address, 4)
    : "";

  const balanceQuery = useWalletBalance({
    address: activeAccount?.address,
    chain: walletChain ? walletChain : undefined,
    client,
    tokenAddress,
  });

  const addressOrENS = ensNameQuery.data || shortAddress;
  const pfpUnresolved = socialProfileQuery.data?.filter((p) => p.avatar)[0]
    ?.avatar;

  const { data: pfp } = useQuery({
    enabled: !!pfpUnresolved,
    queryFn: async () => {
      if (!pfpUnresolved) {
        return undefined;
      }
      return parseAvatarRecord({ client, uri: pfpUnresolved });
    },
    queryKey: ["ens-avatar", pfpUnresolved],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  const name =
    socialProfileQuery.data?.filter((p) => p.name)[0]?.name || addressOrENS;

  return {
    addressOrENS,
    balanceQuery,
    ensAvatarQuery,
    ensNameQuery,
    name,
    pfp,
    shortAddress,
    socialProfileQuery,
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
 * console.log("wallet name", walletInfo?.name);
 * ```
 * @wallet
 */
export function useWalletInfo(id: WalletId | undefined) {
  return useQuery<WalletInfo>({
    enabled: !!id,
    queryFn: () => {
      if (!id) {
        throw new Error("Wallet id is required");
      }
      return getWalletInfo(id, false);
    },
    queryKey: ["wallet-info", id],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
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
    enabled: !!id,
    queryFn: async () => {
      if (!id) {
        throw new Error("Wallet id is required");
      }
      const { getInstalledWalletProviders } = await import(
        "../../../wallets/injected/mipdStore.js"
      );
      const mipdImage = getInstalledWalletProviders().find(
        (x) => x.info.rdns === id,
      )?.info.icon;
      if (mipdImage) {
        return mipdImage;
      }
      return getWalletInfo(id, true);
    },
    queryKey: ["wallet-image", id],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
  });
}
