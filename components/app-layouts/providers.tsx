import { SolanaProvider } from "./solana-provider";
import { useDashboardEVMChainId } from "@3rdweb-sdk/react";
import { useQueryClient } from "@tanstack/react-query";
import { ThirdwebProvider, WalletConnector } from "@thirdweb-dev/react";
import { EVM_RPC_URL_MAP, getEVMRPC } from "constants/rpc";
import { useNativeColorMode } from "hooks/useNativeColorMode";
import { StorageSingleton } from "lib/sdk";
import { ComponentWithChildren } from "types/component-with-children";

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
      rpcUrls: EVM_RPC_URL_MAP,
    },
  });
}

export const DashboardThirdwebProvider: ComponentWithChildren = ({
  children,
}) => {
  useNativeColorMode();
  const queryClient = useQueryClient();

  const activeChainId = useDashboardEVMChainId();

  return (
    <ThirdwebProvider
      queryClient={queryClient}
      dAppMeta={{
        name: "thirdweb",
        logoUrl: "https://thirdweb.com/favicon.ico",
        isDarkMode: false,
        url: "https://thirdweb.com",
      }}
      chainRpc={EVM_RPC_URL_MAP}
      desiredChainId={activeChainId}
      sdkOptions={{
        gasSettings: { maxPriceInGwei: 650 },
        readonlySettings: activeChainId
          ? {
              chainId: activeChainId,
              rpcUrl: getEVMRPC(activeChainId),
            }
          : undefined,
      }}
      storageInterface={StorageSingleton}
      walletConnectors={walletConnectors}
    >
      <SolanaProvider>{children}</SolanaProvider>
    </ThirdwebProvider>
  );
};
