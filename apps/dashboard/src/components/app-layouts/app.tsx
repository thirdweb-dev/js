import { isProd } from "@/constants/env";
import type { EVMContractInfo } from "@3rdweb-sdk/react";
import { CustomConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import { SimpleGrid } from "@chakra-ui/react";
import {
  type DehydratedState,
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { AppShell, type AppShellProps } from "components/layout/app-shell";
import { Onboarding as OnboardingModal } from "components/onboarding";
import { OpCreditsGrantedModalWrapper } from "components/onboarding/OpCreditsGrantedModalWrapper";
import { PosthogIdentifier } from "components/wallets/PosthogIdentifier";
import { ErrorProvider } from "contexts/error-handler";
import { isSanctionedAddress } from "data/eth-sanctioned-addresses";
import { useEffect, useMemo, useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { Heading } from "tw-components";
import type { ComponentWithChildren } from "types/component-with-children";
import { SyncChainStores } from "../../stores/chainStores";
import { DashboardThirdwebProvider } from "./providers";

interface AppLayoutProps extends AppShellProps {
  dehydratedState?: DehydratedState;
  contractInfo?: EVMContractInfo;
}

export const AppLayout: ComponentWithChildren<AppLayoutProps> = (props) => {
  // has to be constructed in here because it may otherwise share state between SSR'd pages
  const [queryClient] = useState(() => new QueryClient({}));

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
      <HydrationBoundary state={props.dehydratedState}>
        <ErrorProvider>
          <SyncChainStores />
          <DashboardThirdwebProvider>
            <SanctionedAddressesChecker>
              <PosthogIdentifier />

              <OnboardingModal />
              <OpCreditsGrantedModalWrapper />

              <AppShell {...props} />
            </SanctionedAddressesChecker>
          </DashboardThirdwebProvider>
        </ErrorProvider>
      </HydrationBoundary>
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
        <div className="flex flex-col items-center gap-4">
          <Heading as="p">Address is blocked</Heading>
          <CustomConnectWallet />
        </div>
      </SimpleGrid>
    );
  }
  return <>{children}</>;
};
