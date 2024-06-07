"use client";

import {
  EVMContractInfo,
  useEVMContractInfo,
} from "@3rdweb-sdk/react/hooks/useActiveChainId";
import { useSupportedChains } from "hooks/chains/configureChains";
import { useNativeColorMode } from "hooks/useNativeColorMode";
import { ComponentWithChildren } from "types/component-with-children";
import { useRouter } from "next/router";
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
      {children}
    </DashboardThirdwebProviderSetup>
  );
};
