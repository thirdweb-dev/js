"use client";

import {
  type EVMContractInfo,
  useEVMContractInfo,
} from "@3rdweb-sdk/react/hooks/useActiveChainId";
import {
  useChain,
  useDisconnect,
  useSigner,
  useSwitchChain,
} from "@thirdweb-dev/react";
import { useSupportedChains } from "hooks/chains/configureChains";
import { useNativeColorMode } from "hooks/useNativeColorMode";
import { useEffect, useRef } from "react";
import type { ComponentWithChildren } from "types/component-with-children";
import {
  useSetActiveWallet,
  useDisconnect as useDisconnectV5,
} from "thirdweb/react";
import { ethers5Adapter } from "thirdweb/adapters/ethers5";
import { createWalletAdapter } from "thirdweb/wallets";
import { useRouter } from "next/router";
import { defineChain } from "thirdweb";
import { thirdwebClient } from "../../lib/thirdweb-client";
import { DashboardThirdwebProviderSetup } from "./provider-setup";

export interface DashboardThirdwebProviderProps {
  contractInfo?: EVMContractInfo;
}

export const DashboardThirdwebProvider: ComponentWithChildren<
  DashboardThirdwebProviderProps
> = ({ children }) => {
  useNativeColorMode();
  const supportedChains = useSupportedChains();
  const contractInfo = useEVMContractInfo();
  const router = useRouter();
  const isChainSlugPage = router.pathname === "/[chain_id]";
  const chainByChainSlug = supportedChains.find(
    (supportedChain) => supportedChain.slug === router.asPath.split("/")[1],
  );

  const activeChain =
    contractInfo?.chain === null
      ? undefined
      : isChainSlugPage
        ? chainByChainSlug
        : contractInfo?.chain;

  return (
    <DashboardThirdwebProviderSetup
      contractInfo={contractInfo}
      activeChain={activeChain}
    >
      <V4ToV5SignerAdapter />
      {children}
    </DashboardThirdwebProviderSetup>
  );
};

const V4ToV5SignerAdapter = () => {
  const signer = useSigner();
  const chain = useChain();
  const switchChain = useSwitchChain();
  const disconnect = useDisconnect();
  const setActiveWallet = useSetActiveWallet();

  const { disconnect: disconnectv5 } = useDisconnectV5();

  const currentWallet = useRef<any>(null);

  // will removes as part of: https://github.com/thirdweb-dev/dashboard/pull/2648
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    let active = true;

    async function run() {
      if (signer && chain) {
        const adaptedAccount = await ethers5Adapter.signer.fromEthers({
          signer,
        });
        if (!active) {
          return;
        }
        const thirdwebWallet = createWalletAdapter({
          adaptedAccount,
          chain: defineChain(chain),
          switchChain: async (chain_) => {
            await switchChain(chain_.id);
          },
          onDisconnect: async () => {
            await disconnect();
          },
          client: thirdwebClient,
        });
        await setActiveWallet(thirdwebWallet);
        currentWallet.current = thirdwebWallet;
      } else if (currentWallet.current) {
        disconnectv5(currentWallet.current);
        currentWallet.current = null;
      }
    }

    run().catch((error) => {
      console.error("failed to adapt wallet", error);
    });

    return () => {
      active = false;
    };
    // purposefully omit switchChain and disconnect from hooks
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer, chain]);

  return null;
};
