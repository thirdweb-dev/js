import {
  EVMContractInfo,
  useEVMContractInfo,
} from "@3rdweb-sdk/react/hooks/useActiveChainId";
import { useApiAuthToken } from "@3rdweb-sdk/react/hooks/useApi";
import { useQueryClient } from "@tanstack/react-query";
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
  useChain,
  useDisconnect,
  useSigner,
  useSwitchChain,
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
import { useEffect, useMemo, useRef } from "react";
import { ComponentWithChildren } from "types/component-with-children";
import { THIRDWEB_API_HOST, THIRDWEB_DOMAIN } from "../../constants/urls";
import {
  ThirdwebProvider,
  useSetActiveWallet,
  useDisconnect as useDisconnectV5,
} from "thirdweb/react";
import { ethers5Adapter } from "thirdweb/adapters/ethers5";
import { createWalletAdapter } from "thirdweb/wallets";
import { useRouter } from "next/router";
import { defineChain } from "thirdweb";
import { thirdwebClient } from "../../lib/thirdweb-client";

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

  const router = useRouter();

  const isChainSlugPage = router.pathname === "/[chainSlug]";

  const chainByChainSlug = supportedChains.find(
    (supportedChain) => supportedChain.slug === router.asPath.split("/")[1],
  );

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
        activeChain={
          chain === null
            ? undefined
            : isChainSlugPage
              ? chainByChainSlug
              : chain
        }
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
        <V4ToV5SignerAdapter />
        {children}
      </ThirdwebProviderOld>
    </ThirdwebProvider>
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
