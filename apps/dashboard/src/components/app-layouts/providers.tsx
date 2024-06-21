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
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { defineChain } from "thirdweb";
import { ethers5Adapter } from "thirdweb/adapters/ethers5";
import {
  useDisconnect as useDisconnectV5,
  useSetActiveWallet,
} from "thirdweb/react";
import { createWalletAdapter } from "thirdweb/wallets";
import type { ComponentWithChildren } from "types/component-with-children";
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

  // biome-ignore lint/suspicious/noExplicitAny: FIXME
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
  }, [signer, chain, disconnect, setActiveWallet, disconnectv5, switchChain]);

  return null;
};
