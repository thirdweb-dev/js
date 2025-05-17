import { useQuery } from "@tanstack/react-query";
import type { Chain } from "../../../../../../../chains/types.js";
import { getCachedChain } from "../../../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../../../constants/addresses.js";
import { isInsightEnabled } from "../../../../../../../insight/common.js";
import { getOwnedTokens } from "../../../../../../../insight/get-tokens.js";
import type { Wallet } from "../../../../../../../wallets/interfaces/wallet.js";
import {
  type GetWalletBalanceResult,
  getWalletBalance,
} from "../../../../../../../wallets/utils/getWalletBalance.js";
import type { WalletId } from "../../../../../../../wallets/wallet-types.js";
import type { PayUIOptions } from "../../../../../../core/hooks/connection/ConnectButtonProps.js";
import { useChainMetadata } from "../../../../../../core/hooks/others/useChainQuery.js";
import { useActiveAccount } from "../../../../../../core/hooks/wallets/useActiveAccount.js";
import { useConnectedWallets } from "../../../../../../core/hooks/wallets/useConnectedWallets.js";
import type {
  SupportedTokens,
  TokenInfo,
} from "../../../../../../core/utils/defaultTokens.js";
import { type ERC20OrNativeToken, isNativeToken } from "../../nativeToken.js";

const CHUNK_SIZE = 5;

function chunkChains<T>(chains: T[]): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < chains.length; i += CHUNK_SIZE) {
    chunks.push(chains.slice(i, i + CHUNK_SIZE));
  }
  return chunks;
}

type FetchBalancesParams = {
  wallet: Wallet;
  accountAddress: string | undefined;
  sourceSupportedTokens: SupportedTokens;
  toChain: Chain;
  toToken: ERC20OrNativeToken;
  mode: PayUIOptions["mode"];
  client: ThirdwebClient;
};

export type TokenBalance = {
  balance: GetWalletBalanceResult;
  chain: Chain;
  token: TokenInfo;
};

type WalletKey = {
  id: WalletId;
  address: string;
};

export function useWalletsAndBalances(props: {
  sourceSupportedTokens: SupportedTokens;
  toChain: Chain;
  toToken: ERC20OrNativeToken;
  mode: PayUIOptions["mode"];
  client: ThirdwebClient;
}) {
  const activeAccount = useActiveAccount();
  const connectedWallets = useConnectedWallets();
  const chainInfo = useChainMetadata(props.toChain);

  return useQuery({
    queryKey: [
      "wallets-and-balances",
      props.sourceSupportedTokens,
      props.toChain.id,
      props.toToken,
      props.mode,
      activeAccount?.address,
      connectedWallets.map((w) => w.getAccount()?.address),
    ],
    enabled:
      !!props.sourceSupportedTokens && !!chainInfo.data && !!activeAccount,
    queryFn: async () => {
      const entries = await Promise.all(
        connectedWallets.map(async (wallet) => {
          const balances = await fetchBalancesForWallet({
            wallet,
            accountAddress: activeAccount?.address,
            sourceSupportedTokens: props.sourceSupportedTokens || [],
            toChain: props.toChain,
            toToken: props.toToken,
            mode: props.mode,
            client: props.client,
          });
          return [
            {
              id: wallet.id,
              address: wallet.getAccount()?.address || "",
            } as WalletKey,
            balances,
          ] as const;
        }),
      );
      const map = new Map<WalletKey, TokenBalance[]>();
      for (const entry of entries) {
        map.set(entry[0], entry[1]);
      }
      return map;
    },
  });
}

async function fetchBalancesForWallet({
  wallet,
  accountAddress,
  sourceSupportedTokens,
  toChain,
  toToken,
  mode,
  client,
}: FetchBalancesParams): Promise<TokenBalance[]> {
  const account = wallet.getAccount();
  if (!account) {
    return [];
  }

  const balances: TokenBalance[] = [];

  // 1. Resolve all unique chains in the supported token map
  const uniqueChains = Object.keys(sourceSupportedTokens).map((id) =>
    getCachedChain(Number(id)),
  );

  // 2. Check insight availability once per chain
  const insightSupport = await Promise.all(
    uniqueChains.map(async (c) => ({
      chain: c,
      enabled: await isInsightEnabled(c),
    })),
  );
  const insightEnabledChains = insightSupport
    .filter((c) => c.enabled)
    .map((c) => c.chain);

  // 3. ERC-20 balances for insight-enabled chains (batched 5 chains / call)
  const insightChunks = chunkChains(insightEnabledChains);
  await Promise.all(
    insightChunks.map(async (chunk) => {
      const owned = await getOwnedTokens({
        ownerAddress: account.address,
        chains: chunk,
        client,
      });

      for (const b of owned) {
        const matching = sourceSupportedTokens[b.chainId]?.find(
          (t) => t.address.toLowerCase() === b.tokenAddress.toLowerCase(),
        );
        if (matching) {
          balances.push({
            balance: b,
            chain: getCachedChain(b.chainId),
            token: matching,
          });
        }
      }
    }),
  );

  // 4. Build a token map that also includes the destination token so it can be used to pay
  const destinationToken = isNativeToken(toToken)
    ? {
        address: NATIVE_TOKEN_ADDRESS,
        name: toChain.nativeCurrency?.name || "",
        symbol: toChain.nativeCurrency?.symbol || "",
        icon: toChain.icon?.url,
      }
    : toToken;

  const tokenMap: Record<number, TokenInfo[]> = {
    ...sourceSupportedTokens,
    [toChain.id]: [
      destinationToken,
      ...(sourceSupportedTokens[toChain.id] || []),
    ],
  };

  // 5. Fallback RPC balances (native currency & ERC-20 that we couldn't fetch from insight)
  const rpcCalls: Promise<void>[] = [];

  for (const [chainIdStr, tokens] of Object.entries(tokenMap)) {
    const chainId = Number(chainIdStr);
    const chain = getCachedChain(chainId);

    for (const token of tokens) {
      const isNative = isNativeToken(token);
      const isAlreadyFetched = balances.some(
        (b) =>
          b.chain.id === chainId &&
          b.token.address.toLowerCase() === token.address.toLowerCase(),
      );
      if (isAlreadyFetched && !isNative) {
        // ERC20 on insight-enabled chain already handled by insight call
        continue;
      }
      rpcCalls.push(
        (async () => {
          try {
            const balance = await getWalletBalance({
              address: account.address,
              chain,
              tokenAddress: isNative ? undefined : token.address,
              client,
            });

            const include =
              token.address.toLowerCase() ===
                destinationToken.address.toLowerCase() &&
              chain.id === toChain.id
                ? !(
                    mode === "fund_wallet" && account.address === accountAddress
                  ) && balance.value > 0n
                : balance.value > 0n;

            if (include) {
              balances.push({ balance, chain, token });
            }
          } catch (err) {
            console.warn(
              `Failed to fetch balance for ${token.symbol} on chain ${chainId}`,
              err,
            );
          }
        })(),
      );
    }
  }

  await Promise.all(rpcCalls);

  // Remove duplicates (same chainId + token address)
  {
    const uniq: Record<string, TokenBalance> = {};
    for (const b of balances) {
      const k = `${b.chain.id}-${b.token.address.toLowerCase()}`;
      if (!uniq[k]) {
        uniq[k] = b;
      }
    }
    balances.splice(0, balances.length, ...Object.values(uniq));
  }
  // 6. Sort so that the destination token always appears first, then tokens on the destination chain, then by chain id
  balances.sort((a, b) => {
    const destAddress = destinationToken.address;
    if (a.chain.id === toChain.id && a.token.address === destAddress) return -1;
    if (b.chain.id === toChain.id && b.token.address === destAddress) return 1;
    if (a.chain.id === toChain.id) return -1;
    if (b.chain.id === toChain.id) return 1;
    return a.chain.id - b.chain.id;
  });

  return balances;
}
