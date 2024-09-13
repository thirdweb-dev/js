"use client";

import { useEVMContractInfo } from "@3rdweb-sdk/react/hooks/useActiveChainId";
import { useSupportedChainsSlugRecord } from "hooks/chains/configureChains";
import { useNativeColorMode } from "hooks/useNativeColorMode";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { ThirdwebProvider, webLocalStorage } from "thirdweb/react";
import { createConnectionManager } from "thirdweb/wallets";
import type { ComponentWithChildren } from "types/component-with-children";
import { DashboardThirdwebProviderSetup } from "./provider-setup";

const connectionManager = createConnectionManager(webLocalStorage, {
  initialIsAutoConnecting: true,
});

export const DashboardThirdwebProvider: ComponentWithChildren = ({
  children,
}) => {
  useNativeColorMode();
  const chainsSlugRecord = useSupportedChainsSlugRecord();
  const contractInfo = useEVMContractInfo();
  const router = useRouter();
  const isChainSlugPage = router.pathname === "/[chain_id]";
  const chainByChainSlug = chainsSlugRecord[router.asPath.split("/")[1]];

  const activeChain = useMemo(() => {
    return contractInfo?.chain === null
      ? undefined
      : isChainSlugPage
        ? chainByChainSlug
        : contractInfo?.chain;
  }, [contractInfo, chainByChainSlug, isChainSlugPage]);

  return (
    <ThirdwebProvider connectionManager={connectionManager}>
      <DashboardThirdwebProviderSetup
        contractInfo={contractInfo}
        activeChain={activeChain}
      >
        {children}
      </DashboardThirdwebProviderSetup>
    </ThirdwebProvider>
  );
};
