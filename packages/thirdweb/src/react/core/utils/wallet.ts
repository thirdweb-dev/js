import { useQuery } from "@tanstack/react-query";
import { ethereum } from "../../../chains/chain-definitions/ethereum.js";
import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { resolveAvatar } from "../../../extensions/ens/resolve-avatar.js";
import { resolveName } from "../../../extensions/ens/resolve-name.js";
import { getSocialProfiles } from "../../../social/profiles.js";
import { shortenAddress } from "../../../utils/address.js";
import { parseAvatarRecord } from "../../../utils/ens/avatar.js";
import { getWalletInfo } from "../../../wallets/__generated__/getWalletInfo.js";
import type { Profile } from "../../../wallets/in-app/core/authentication/types.js";
import type { Account, Wallet } from "../../../wallets/interfaces/wallet.js";
import type { WalletInfo } from "../../../wallets/wallet-info.js";
import type { WalletId } from "../../../wallets/wallet-types.js";
import { useProfiles } from "../hooks/others/useProfiles.js";
import { useWalletBalance } from "../hooks/others/useWalletBalance.js";
import { useConnectedWallets } from "../hooks/wallets/useConnectedWallets.js";

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

  const connectedWallets = useConnectedWallets();

  const { data: linkedAccounts } = useProfiles();

  const socialProfileQuery = useQuery({
    queryKey: [
      "social-profiles",
      activeAccount?.address,
      linkedAccounts,
      connectedWallets,
    ],
    queryFn: async () => {
      if (!activeAccount?.address) {
        return [];
      }

      const primaryAccountProfiles = await getSocialProfiles({
        client,
        address: activeAccount?.address,
      });

      const connectedWalletProfiles = await Promise.all(
        connectedWallets
          .map((w: Wallet) => w.getAccount())
          .filter(
            (a: Account | undefined) =>
              a !== undefined && a.address !== activeAccount.address,
          )
          .flatMap(async (account) => {
            return await getSocialProfiles({
              client,
              address: (account as Account).address,
            });
          }),
      );

      if (!linkedAccounts) {
        return [...primaryAccountProfiles, ...connectedWalletProfiles.flat()];
      }

      const linkedAccountProfiles = await Promise.all(
        linkedAccounts
          .map((a: Profile) => a.details.address)
          .filter((a: string | undefined) => a !== undefined)
          .flatMap(async (linkedAddress) => {
            return await getSocialProfiles({
              client,
              address: linkedAddress as string,
            });
          }),
      );

      return [
        ...primaryAccountProfiles,
        ...connectedWalletProfiles.flat(),
        ...linkedAccountProfiles.flat(),
      ];
    },
    enabled: !!activeAccount?.address,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  const shortAddress = activeAccount?.address
    ? shortenAddress(activeAccount.address, 4)
    : "";

  const balanceQuery = useWalletBalance({
    chain: walletChain ? walletChain : undefined,
    tokenAddress,
    address: activeAccount?.address,
    client,
  });

  const addressOrENS = ensNameQuery.data || shortAddress;
  const pfpUnresolved = socialProfileQuery.data?.filter((p) => p.avatar)[0]
    ?.avatar;

  const { data: pfp } = useQuery({
    queryKey: ["ens-avatar", pfpUnresolved],
    queryFn: async () => {
      if (!pfpUnresolved) {
        return undefined;
      }
      return parseAvatarRecord({ client, uri: pfpUnresolved });
    },
    enabled: !!pfpUnresolved,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  const name =
    socialProfileQuery.data?.filter((p) => p.name)[0]?.name || addressOrENS;

  return {
    socialProfileQuery,
    ensNameQuery,
    ensAvatarQuery,
    addressOrENS,
    pfp,
    name,
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
