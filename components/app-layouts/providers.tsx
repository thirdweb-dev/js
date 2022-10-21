import { SolanaProvider } from "./solana-provider";
import { useDashboardEVMChainId } from "@3rdweb-sdk/react";
import { useQueryClient } from "@tanstack/react-query";
import { ThirdwebProvider, WalletConnector } from "@thirdweb-dev/react";
import { GnosisSafeConnector } from "@thirdweb-dev/react/evm/connectors/gnosis-safe";
import { MagicConnector } from "@thirdweb-dev/react/evm/connectors/magic";
import { EVM_RPC_URL_MAP, getEVMRPC } from "constants/rpc";
import { useNativeColorMode } from "hooks/useNativeColorMode";
import { StorageSingleton } from "lib/sdk";
import { useMemo } from "react";
import { ComponentWithChildren } from "types/component-with-children";

export const DashboardThirdwebProvider: ComponentWithChildren = ({
  children,
}) => {
  useNativeColorMode();
  const queryClient = useQueryClient();

  const activeChainId = useDashboardEVMChainId();

  const walletConnectors = useMemo(() => {
    let wc: WalletConnector[] = [
      "metamask",
      "walletConnect",
      "walletLink",
      new GnosisSafeConnector({}),
    ];
    if (process.env.NEXT_PUBLIC_MAGIC_KEY) {
      wc = wc.concat(
        new MagicConnector({
          options: {
            apiKey: process.env.NEXT_PUBLIC_MAGIC_KEY,
            rpcUrls: EVM_RPC_URL_MAP,
            network: activeChainId && {
              rpcUrl: getEVMRPC(activeChainId),
              chainId: activeChainId,
            },
            doNotAutoConnect: true,
          },
        }),
      );
    }
    return wc;
  }, [activeChainId]);

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
