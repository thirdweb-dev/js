import {
  EVMContractInfo,
  useEVMContractInfo,
} from "@3rdweb-sdk/react/hooks/useActiveChainId";
import { useApiAuthToken } from "@3rdweb-sdk/react/hooks/useApi";
import { useQueryClient } from "@tanstack/react-query";
import {
  ThirdwebProvider,
  coinbaseWallet,
  embeddedWallet,
  localWallet,
  metamaskWallet,
  phantomWallet,
  rainbowWallet,
  safeWallet,
  trustWallet,
  walletConnect,
  zerionWallet,
} from "@thirdweb-dev/react";
import {
  GLOBAL_AUTH_TOKEN_KEY,
  GLOBAL_PAPER_AUTH_TOKEN_KEY,
} from "constants/app";
import {
  DASHBOARD_THIRDWEB_CLIENT_ID,
  DASHBOARD_THIRDWEB_SECRET_KEY,
} from "constants/rpc";
import { useSupportedChains } from "hooks/chains/configureChains";
import { useNativeColorMode } from "hooks/useNativeColorMode";
import { getDashboardChainRpc } from "lib/rpc";
import { StorageSingleton } from "lib/sdk";
import { useEffect, useMemo } from "react";
import { ComponentWithChildren } from "types/component-with-children";
import { THIRDWEB_API_HOST, THIRDWEB_DOMAIN } from "../../constants/urls";

export interface DashboardThirdwebProviderProps {
  contractInfo?: EVMContractInfo;
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
      // expose paper auth token for onboarding screens to pick up and clear up
      (window as any)[GLOBAL_PAPER_AUTH_TOKEN_KEY] = storedToken.cookieString;
    },
  }),
  localWallet(),
];

export const dashboardSupportedWallets = [
  ...personalWallets,
  safeWallet({
    personalWallets,
  }),
];

export const DashboardThirdwebProvider: ComponentWithChildren<
  DashboardThirdwebProviderProps
> = ({ children }) => {
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
    <ThirdwebProvider
      queryClient={queryClient}
      dAppMeta={{
        name: "thirdweb",
        logoUrl: "https://thirdweb.com/favicon.ico",
        isDarkMode: false,
        url: "https://thirdweb.com",
      }}
      activeChain={chain === null ? undefined : chain}
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
    </ThirdwebProvider>
  );
};

const GlobalAuthTokenProvider = () => {
  const { token, isLoading } = useApiAuthToken();

  useEffect(() => {
    if (token && !isLoading) {
      (window as any)[GLOBAL_AUTH_TOKEN_KEY] = token;
    } else {
      (window as any)[GLOBAL_AUTH_TOKEN_KEY] = undefined;
    }
  }, [token, isLoading]);

  return null;
};
