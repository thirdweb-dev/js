import { isProd } from "@/constants/env";
import {
  type EVMContractInfo,
  EVMContractInfoProvider,
} from "@3rdweb-sdk/react";
import { CustomConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import { Flex, SimpleGrid } from "@chakra-ui/react";
import {
  type DehydratedState,
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ConfigureNetworkModal } from "components/configure-networks/ConfigureNetworkModal";
import { AppShell, type AppShellProps } from "components/layout/app-shell";
import { Onboarding as OnboardingModal } from "components/onboarding";
import { OpCreditsGrantedModalWrapper } from "components/onboarding/OpCreditsGrantedModalWrapper";
import { PosthogIdentifier } from "components/wallets/PosthogIdentifier";
import { AllChainsProvider } from "contexts/all-chains";
import { ChainsProvider } from "contexts/configured-chains";
import { ErrorProvider } from "contexts/error-handler";
import { isSanctionedAddress } from "data/eth-sanctioned-addresses";
import { useAddRecentlyUsedChainId } from "hooks/chains/recentlyUsedChains";
import {
  useIsNetworkConfigModalOpen,
  useSetIsNetworkConfigModalOpen,
} from "hooks/networkConfigModal";
import { useEffect, useMemo, useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { Heading } from "tw-components";
import type { ComponentWithChildren } from "types/component-with-children";
import { DashboardThirdwebProvider } from "./providers";

interface AppLayoutProps extends AppShellProps {
  dehydratedState?: DehydratedState;
  contractInfo?: EVMContractInfo;
}

export const AppLayout: ComponentWithChildren<AppLayoutProps> = (props) => {
  // has to be constructed in here because it may otherwise share state between SSR'd pages
  const [queryClient] = useState(() => new QueryClient());

  // will be deleted as part of: https://github.com/thirdweb-dev/dashboard/pull/2648
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (!isProd) {
      localStorage.setItem("IS_THIRDWEB_DEV", "true");
      localStorage.setItem(
        "THIRDWEB_DEV_URL",
        "https://embedded-wallet.thirdweb-dev.com",
      );
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={props.dehydratedState}>
        <ErrorProvider>
          <AllChainsProvider>
            <ChainsProvider>
              <EVMContractInfoProvider value={props.contractInfo}>
                <DashboardThirdwebProvider>
                  <SanctionedAddressesChecker>
                    <PosthogIdentifier />
                    <ConfigModal />

                    <OnboardingModal />
                    <OpCreditsGrantedModalWrapper />

                    <AppShell {...props} />
                  </SanctionedAddressesChecker>
                </DashboardThirdwebProvider>
              </EVMContractInfoProvider>
            </ChainsProvider>
          </AllChainsProvider>
        </ErrorProvider>
      </Hydrate>
    </QueryClientProvider>
  );
};

const SanctionedAddressesChecker: ComponentWithChildren = ({ children }) => {
  const address = useActiveAccount()?.address;
  const isBlocked = useMemo(() => {
    return address && isSanctionedAddress(address);
  }, [address]);
  if (isBlocked) {
    return (
      <SimpleGrid
        position="fixed"
        top={0}
        right={0}
        bottom={0}
        left={0}
        placeItems="center"
        bg="black"
        zIndex="banner"
      >
        <Flex gap={4} direction="column" align="center">
          <Heading as="p">Address is blocked</Heading>
          <CustomConnectWallet />
        </Flex>
      </SimpleGrid>
    );
  }
  return <>{children}</>;
};

function ConfigModal() {
  const isNetworkConfigModalOpen = useIsNetworkConfigModalOpen();
  const setIsNetworkConfigModalOpen = useSetIsNetworkConfigModalOpen();
  const addRecentlyUsedChains = useAddRecentlyUsedChainId();

  if (!isNetworkConfigModalOpen) {
    return null;
  }

  return (
    <ConfigureNetworkModal
      onNetworkAdded={(_chain) => {
        addRecentlyUsedChains(_chain.chainId);
      }}
      onClose={() => setIsNetworkConfigModalOpen(false)}
    />
  );
}
