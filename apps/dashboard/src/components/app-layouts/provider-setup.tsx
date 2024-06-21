"use client";

import {
  type EVMContractInfo,
  useEVMContractInfo,
} from "@3rdweb-sdk/react/hooks/useActiveChainId";
import { useApiAuthToken } from "@3rdweb-sdk/react/hooks/useApi";
import { useQueryClient } from "@tanstack/react-query";
import type { Chain } from "@thirdweb-dev/chains";
import {
  ThirdwebProvider as ThirdwebProviderOld,
  coin98Wallet,
  coinbaseWallet,
  coreWallet,
  cryptoDefiWallet,
  embeddedWallet,
  localWallet,
  metamaskWallet,
  okxWallet,
  oneKeyWallet,
  phantomWallet,
  rabbyWallet,
  rainbowWallet,
  safeWallet,
  trustWallet,
  walletConnect,
  zerionWallet,
} from "@thirdweb-dev/react";
import { GLOBAL_AUTH_TOKEN_KEY, storeEWSToken } from "constants/app";
import {
  DASHBOARD_THIRDWEB_CLIENT_ID,
  DASHBOARD_THIRDWEB_SECRET_KEY,
} from "constants/rpc";
import { useSupportedChains } from "hooks/chains/configureChains";
import { useNativeColorMode } from "hooks/useNativeColorMode";
import { getDashboardChainRpc } from "lib/rpc";
import { StorageSingleton } from "lib/sdk";
import { useEffect, useMemo } from "react";
import { ThirdwebProvider } from "thirdweb/react";
import type { ComponentWithChildren } from "types/component-with-children";
import { THIRDWEB_API_HOST, THIRDWEB_DOMAIN } from "../../constants/urls";

export interface DashboardThirdwebProviderProps {
  contractInfo?: EVMContractInfo;
  activeChain?: Chain;
}

const personalWallets = [
  metamaskWallet(),
  coinbaseWallet(),
  walletConnect({
    qrModalOptions: {
      themeVariables: {
        "--wcm-z-index": "10000",
      },
    },
  }),
  rainbowWallet(),
  trustWallet(),
  zerionWallet(),
  phantomWallet(),
  embeddedWallet({
    onAuthSuccess: ({ storedToken }) => {
      // save authToken to localstorage
      storeEWSToken(storedToken.cookieString);
    },
  }),
  localWallet(),
  rabbyWallet(),
  okxWallet(),
  coin98Wallet(),
  coreWallet(),
  cryptoDefiWallet(),
  oneKeyWallet(),
];

const dashboardSupportedWallets = [
  ...personalWallets,
  safeWallet({
    personalWallets,
  }),
];

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

  return (
    <ThirdwebProvider>
      <ThirdwebProviderOld
        queryClient={queryClient}
        dAppMeta={{
          name: "thirdweb",
          logoUrl: "https://thirdweb.com/favicon.ico",
          isDarkMode: false,
          url: "https://thirdweb.com",
        }}
        activeChain={activeChain}
        supportedChains={supportedChains}
        sdkOptions={{
          gasSettings: { maxPriceInGwei: 650 },
          readonlySettings,
        }}
        clientId={DASHBOARD_THIRDWEB_CLIENT_ID}
        secretKey={DASHBOARD_THIRDWEB_SECRET_KEY}
        supportedWallets={dashboardSupportedWallets}
        storageInterface={StorageSingleton}
        authConfig={{
          domain: THIRDWEB_DOMAIN,
          authUrl: `${THIRDWEB_API_HOST}/v1/auth`,
        }}
      >
        <GlobalAuthTokenProvider />
        {children}
      </ThirdwebProviderOld>
    </ThirdwebProvider>
  );
};

const GlobalAuthTokenProvider = () => {
  const { token, isLoading } = useApiAuthToken();

  // will be deleted as part of: https://github.com/thirdweb-dev/dashboard/pull/2648
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (token && !isLoading) {
      // biome-ignore lint/suspicious/noExplicitAny: FIXME
      (window as any)[GLOBAL_AUTH_TOKEN_KEY] = token;
    } else {
      // biome-ignore lint/suspicious/noExplicitAny: FIXME
      (window as any)[GLOBAL_AUTH_TOKEN_KEY] = undefined;
    }
  }, [token, isLoading]);

  return null;
};
