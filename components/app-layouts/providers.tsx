import { useActiveChainId } from "@3rdweb-sdk/react";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { IpfsStorage } from "@thirdweb-dev/sdk";
import { BigNumber } from "ethers";
import { useNativeColorMode } from "hooks/useNativeColorMode";
import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { createWebStoragePersistor } from "react-query/createWebStoragePersistor-experimental";
import { persistQueryClient } from "react-query/persistQueryClient-experimental";
import { ChainId, SUPPORTED_CHAIN_ID } from "utils/network";

const __CACHE_BUSTER = "tw_v2.0.0-nightly.3";

const queryClient = new QueryClient({
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
  [ChainId.Mainnet]: `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`,
  [ChainId.Rinkeby]: `https://eth-rinkeby.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`,
  [ChainId.Goerli]: `https://eth-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`,
  [ChainId.Fantom]: "https://rpc.ftm.tools",
  [ChainId.Avalanche]: "https://rpc.ankr.com/avalanche",
  [ChainId.Polygon]: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`,
  [ChainId.Mumbai]: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`,
};

export const Providers: React.FC = ({ children }) => {
  useNativeColorMode();
  useEffect(() => {
    persistQueryClient({
      queryClient,
      buster: __CACHE_BUSTER,
      persistor: createWebStoragePersistor({
        storage: window.localStorage,
        serialize: (data) => JSON.stringify(data, replacer),
      }),
    });
  }, []);

  const activeChainId = useActiveChainId();
  return (
    <QueryClientProvider client={queryClient}>
      <ThirdwebProvider
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
                rpcUrl: alchemyUrlMap[activeChainId],
              }
            : undefined,
        }}
        storageInterface={StorageSingleton}
      >
        {children}
      </ThirdwebProvider>
    </QueryClientProvider>
  );
};
