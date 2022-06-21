import { useActiveChainId } from "@3rdweb-sdk/react";
import { ThirdwebProvider, WalletConnector } from "@thirdweb-dev/react";
import { ChainId, IpfsStorage, SUPPORTED_CHAIN_ID } from "@thirdweb-dev/sdk";
import { BigNumber } from "ethers";
import { useNativeColorMode } from "hooks/useNativeColorMode";
import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { createWebStoragePersister } from "react-query/createWebStoragePersister";
import { persistQueryClient } from "react-query/persistQueryClient";
import { ComponentWithChildren } from "types/component-with-children";

const __CACHE_BUSTER = "tw_v2.0.2";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 24 hours
      cacheTime: 1000 * 60 * 60 * 24,
      // 30 seconds
      staleTime: 1000 * 30,
    },
  },
});

function replacer(_key: string, value: any) {
  // if we find a BigNumber then make it into a string (since that is safe)
  if (
    BigNumber.isBigNumber(value) ||
    (typeof value === "object" &&
      value !== null &&
      value.type === "BigNumber" &&
      "hex" in value)
  ) {
    return BigNumber.from(value).toString();
  }

  return value;
}

export const StorageSingleton = new IpfsStorage(
  process.env.NEXT_PUBLIC_IPFS_GATEWAY_URL,
);

export const alchemyUrlMap: Record<SUPPORTED_CHAIN_ID, string> = {
  [ChainId.Mainnet]:
    process.env.NEXT_PUBLIC_RPC_MAINNET ||
    `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`,
  [ChainId.Rinkeby]:
    process.env.NEXT_PUBLIC_RPC_RINKEBY ||
    `https://eth-rinkeby.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`,
  [ChainId.Goerli]:
    process.env.NEXT_PUBLIC_RPC_GOERLI ||
    `https://eth-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`,
  [ChainId.Polygon]:
    process.env.NEXT_PUBLIC_RPC_POLYGON ||
    `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`,
  [ChainId.Mumbai]:
    process.env.NEXT_PUBLIC_RPC_MUMBAI ||
    `https://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`,
  [ChainId.Fantom]:
    process.env.NEXT_PUBLIC_RPC_FANTOM || "https://rpc.ftm.tools",
  [ChainId.FantomTestnet]:
    process.env.NEXT_PUBLIC_RPC_FANTOM_TESTNET ||
    "https://rpc.testnet.fantom.network",
  [ChainId.Avalanche]:
    process.env.NEXT_PUBLIC_RPC_AVALANCHE ||
    "https://api.avax.network/ext/bc/C/rpc",
  [ChainId.AvalancheFujiTestnet]:
    process.env.NEXT_PUBLIC_RPC_AVALANCHE_FUJI_TESTNET ||
    "https://api.avax-test.network/ext/bc/C/rpc",
  [ChainId.Optimism]:
    process.env.NEXT_PUBLIC_RPC_OPTIMISM ||
    `https://opt-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`,
  [ChainId.OptimismTestnet]:
    process.env.NEXT_PUBLIC_RPC_OPTIMISM_TESTNET ||
    `https://opt-kovan.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`,
  [ChainId.Arbitrum]:
    process.env.NEXT_PUBLIC_RPC_ARBITRUM ||
    `https://arb-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`,
  [ChainId.ArbitrumTestnet]:
    process.env.NEXT_PUBLIC_RPC_ARBITRUM_TESTNET ||
    `https://arb-rinkeby.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`,
};

const walletConnectors: WalletConnector[] = [
  "metamask",
  "walletConnect",
  "walletLink",
  "gnosis",
];
if (process.env.NEXT_PUBLIC_MAGIC_KEY) {
  walletConnectors.push({
    name: "magic",
    options: {
      apiKey: process.env.NEXT_PUBLIC_MAGIC_KEY,
      rpcUrls: alchemyUrlMap,
    },
  });
}

export const Providers: ComponentWithChildren = ({ children }) => {
  useNativeColorMode();

  useEffect(() => {
    persistQueryClient({
      queryClient,
      buster: __CACHE_BUSTER,
      persister: createWebStoragePersister({
        storage: window.localStorage,
        serialize: (data) => JSON.stringify(data, replacer),
      }),
    });
  }, []);

  const activeChainId = useActiveChainId();

  return (
    <QueryClientProvider client={queryClient}>
      <ThirdwebProvider
        queryClient={queryClient}
        dAppMeta={{
          name: "thirdweb",
          logoUrl: "https://thirdweb.com/favicon.ico",
          isDarkMode: false,
          url: "https://thirdweb.com",
        }}
        chainRpc={alchemyUrlMap}
        desiredChainId={activeChainId}
        sdkOptions={{
          gasSettings: { maxPriceInGwei: 650 },
          readonlySettings: activeChainId
            ? {
                chainId: activeChainId,
                rpcUrl: alchemyUrlMap[activeChainId as SUPPORTED_CHAIN_ID],
              }
            : undefined,
        }}
        storageInterface={StorageSingleton}
        walletConnectors={walletConnectors}
      >
        {children}
      </ThirdwebProvider>
    </QueryClientProvider>
  );
};
