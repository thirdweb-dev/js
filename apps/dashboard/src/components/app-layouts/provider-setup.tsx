"use client";

import { thirdwebClient } from "@/constants/client";
import {
  type EVMContractInfo,
  useEVMContractInfo,
} from "@3rdweb-sdk/react/hooks/useActiveChainId";
import { useQueryClient } from "@tanstack/react-query";
import type { Chain } from "@thirdweb-dev/chains";
import { ThirdwebSDKProvider } from "@thirdweb-dev/react";
import {
  DASHBOARD_THIRDWEB_CLIENT_ID,
  DASHBOARD_THIRDWEB_SECRET_KEY,
} from "constants/rpc";
import type { Signer } from "ethers";
import { useSupportedChains } from "hooks/chains/configureChains";
import { useNativeColorMode } from "hooks/useNativeColorMode";
import { getDashboardChainRpc } from "lib/rpc";
import { StorageSingleton } from "lib/sdk";
import { useEffect, useMemo, useState } from "react";
import { ethers5Adapter } from "thirdweb/adapters/ethers5";
import {
  useActiveAccount,
  useActiveWallet,
  useActiveWalletChain,
} from "thirdweb/react";
import { setThirdwebDomains } from "thirdweb/utils";
import type { ComponentWithChildren } from "types/component-with-children";
import { THIRDWEB_API_HOST } from "../../constants/urls";

// do this upfront
setThirdwebDomains({
  bundler: `bundler.${THIRDWEB_API_HOST.replace("https://api.", "")}`,
  inAppWallet: `embedded-wallet.${THIRDWEB_API_HOST.replace("https://api.", "")}`,
  pay: `pay.${THIRDWEB_API_HOST.replace("https://api.", "")}`,
  rpc: `rpc.${THIRDWEB_API_HOST.replace("https://api.", "")}`,
  storage: `storage.${THIRDWEB_API_HOST.replace("https://api.", "")}`,
});

export interface DashboardThirdwebProviderProps {
  contractInfo?: EVMContractInfo;
  activeChain?: Chain;
}

export const DashboardThirdwebProviderSetup: ComponentWithChildren<
  DashboardThirdwebProviderProps
> = ({ children, activeChain }) => {
  useNativeColorMode();
  const queryClient = useQueryClient();
  const supportedChains = useSupportedChains();
  const contractInfo = useEVMContractInfo();
  const chain = contractInfo?.chain;
  const readonlySettings = useMemo(() => {
    if (!chain) {
      return undefined;
    }
    const rpcUrl = getDashboardChainRpc(chain);
    if (!rpcUrl) {
      return undefined;
    }
    return {
      chainId: chain.chainId,
      rpcUrl,
    };
  }, [chain]);

  const ethersSigner = useEthersSigner();

  return (
    <ThirdwebSDKProvider
      queryClient={queryClient}
      signer={ethersSigner}
      activeChain={activeChain}
      supportedChains={supportedChains}
      sdkOptions={{
        gasSettings: { maxPriceInGwei: 650 },
        readonlySettings,
      }}
      clientId={DASHBOARD_THIRDWEB_CLIENT_ID}
      secretKey={DASHBOARD_THIRDWEB_SECRET_KEY}
      storageInterface={StorageSingleton}
    >
      {children}
    </ThirdwebSDKProvider>
  );
};

function useEthersSigner() {
  const activeWallet = useActiveWallet();
  const activeAccount = useActiveAccount();
  const activeChain = useActiveWalletChain();
  const [signer, setSigner] = useState<Signer | undefined>(undefined);

  // will be deleted as part of: https://github.com/thirdweb-dev/dashboard/pull/2648
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    let active = true;
    async function run() {
      if (!activeWallet || !activeAccount || !activeChain) {
        setSigner(undefined);
        return;
      }
      try {
        const s = await ethers5Adapter.signer.toEthers({
          account: activeAccount,
          chain: activeChain,
          client: thirdwebClient,
        });
        if (active) {
          setSigner(s);
        }
      } catch (e) {
        console.error("failed to get signer", e);
      }
    }
    run();
    return () => {
      active = false;
    };
  }, [activeAccount, activeChain, activeWallet]);

  return signer;
}
