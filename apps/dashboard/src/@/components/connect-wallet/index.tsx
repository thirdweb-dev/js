"use client";

import { useFavoriteChainIds } from "@app/(dashboard)/(chain)/components/client/star-button";
import { doLogout } from "@app/login/auth-actions";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useCallback, useMemo, useState } from "react";
import type { Chain, ThirdwebClient } from "thirdweb";
import {
  ConnectButton,
  type NetworkSelectorProps,
  useActiveAccount,
  useConnectModal,
} from "thirdweb/react";
import { resetAnalytics } from "@/analytics/reset";
import { CustomChainRenderer } from "@/components/misc/CustomChainRenderer";
import { LazyConfigureNetworkModal } from "@/components/misc/configure-networks/LazyConfigureNetworkModal";
import { Button } from "@/components/ui/button";
import { popularChains } from "@/constants/popularChains";
import { useAllChainsData } from "@/hooks/chains/allChains";
import { useStore } from "@/lib/reactive";
import {
  addRecentlyUsedChainId,
  recentlyUsedChainIdsStore,
  type StoredChain,
} from "@/stores/chainStores";
import { mapV4ChainToV5Chain } from "@/utils/map-chains";
import { getSDKTheme } from "@/utils/sdk-component-theme";

export const CustomConnectWallet = (props: {
  loginRequired?: boolean;
  connectButtonClassName?: string;
  signInLinkButtonClassName?: string;
  detailsButtonClassName?: string;
  chain?: Chain;
  client: ThirdwebClient;
  isLoggedIn: boolean;
}) => {
  const client = props.client;

  const loginRequired =
    props.loginRequired === undefined ? true : props.loginRequired;

  const { theme } = useTheme();
  const t = theme === "light" ? "light" : "dark";

  // chains
  const favChainIdsQuery = useFavoriteChainIds();
  const recentChainIds = useStore(recentlyUsedChainIdsStore);
  const { idToChain, allChainsV5 } = useAllChainsData();

  const recentlyUsedChainsWithMetadata = useMemo(
    () =>
      recentChainIds
        .map((id) => {
          const c = idToChain.get(id);
          // eslint-disable-next-line no-restricted-syntax
          return c ? mapV4ChainToV5Chain(c) : undefined;
        })
        .filter((x) => !!x),
    [recentChainIds, idToChain],
  );

  const favoriteChainsWithMetadata = useMemo(() => {
    return (favChainIdsQuery.data || [])
      .map((id) => {
        const c = idToChain.get(Number(id));
        // eslint-disable-next-line no-restricted-syntax
        return c ? mapV4ChainToV5Chain(c) : undefined;
      })
      .filter((x) => !!x);
  }, [idToChain, favChainIdsQuery.data]);

  const popularChainsWithMetadata = useMemo(() => {
    // eslint-disable-next-line no-restricted-syntax
    return popularChains.map((x) =>
      // eslint-disable-next-line no-restricted-syntax
      {
        const v4Chain = idToChain.get(x.id);
        // eslint-disable-next-line no-restricted-syntax
        return v4Chain ? mapV4ChainToV5Chain(v4Chain) : x;
      },
    );
  }, [idToChain]);

  // Network Config Modal
  const [isNetworkConfigModalOpen, setIsNetworkConfigModalOpen] =
    useState(false);
  const [editChain, setEditChain] = useState<StoredChain | undefined>(
    undefined,
  );

  const chainSections: NetworkSelectorProps["sections"] = useMemo(() => {
    return [
      {
        chains: recentlyUsedChainsWithMetadata,
        label: "Recent",
      },
      {
        chains: favoriteChainsWithMetadata,
        label: "Favorites",
      },
      {
        chains: popularChainsWithMetadata,
        label: "Popular",
      },
    ];
  }, [
    recentlyUsedChainsWithMetadata,
    favoriteChainsWithMetadata,
    popularChainsWithMetadata,
  ]);

  // ensures login status on pages that need it
  const { isLoggedIn } = props;
  const pathname = usePathname();
  const account = useActiveAccount();

  if ((!isLoggedIn || !account) && loginRequired) {
    return (
      <>
        <Button
          asChild
          className={props.signInLinkButtonClassName}
          size="lg"
          variant="default"
        >
          <Link
            href={`/login${pathname ? `?next=${encodeURIComponent(pathname)}` : ""}`}
          >
            Connect Wallet
          </Link>
        </Button>
      </>
    );
  }

  return (
    <>
      <ConnectButton
        appMetadata={{
          logoUrl: "https://thirdweb.com/favicon.ico",
          name: "thirdweb",
          url: "https://thirdweb.com",
        }}
        chain={props.chain}
        chains={allChainsV5}
        client={client}
        connectButton={{
          className: props.connectButtonClassName,
        }}
        connectModal={{
          privacyPolicyUrl: "/privacy-policy",
          showThirdwebBranding: false,
          termsOfServiceUrl: "/terms",
          welcomeScreen: () => <ConnectWalletWelcomeScreen theme={t} />,
        }}
        detailsButton={{
          className: props.detailsButtonClassName,
        }}
        detailsModal={{
          networkSelector: {
            onCustomClick: () => {
              setEditChain(undefined);
              setIsNetworkConfigModalOpen(true);
            },
            onSwitch(chain) {
              addRecentlyUsedChainId(chain.id);
            },
            renderChain(props) {
              return (
                <CustomChainRenderer
                  client={client}
                  {...props}
                  openEditChainModal={(c) => {
                    setIsNetworkConfigModalOpen(true);
                    setEditChain(c);
                  }}
                />
              );
            },
            sections: chainSections,
          },
        }}
        onDisconnect={async () => {
          try {
            await doLogout();
            resetAnalytics();
          } catch (err) {
            console.error("Failed to log out", err);
          }
        }}
        theme={getSDKTheme(t)}
      />

      <LazyConfigureNetworkModal
        client={client}
        editChain={editChain}
        onOpenChange={setIsNetworkConfigModalOpen}
        open={isNetworkConfigModalOpen}
      />
    </>
  );
};

function ConnectWalletWelcomeScreen(props: {
  theme: "light" | "dark";
  subtitle?: string;
}) {
  const fontColor = props.theme === "light" ? "black" : "white";
  const subtitle = props.subtitle ?? "Connect your wallet to get started";

  return (
    <div
      className="flex h-full flex-col bg-center bg-cover bg-no-repeat p-6"
      style={{
        backgroundColor: props.theme === "dark" ? "#18132f" : "#c7b5f1",
        backgroundImage: `url("/assets/connect-wallet/welcome-gradient-${props.theme}.png")`,
      }}
    >
      <div className="flex flex-grow flex-col justify-center">
        <div>
          <div className="flex justify-center">
            <Image
              alt=""
              className="select-none"
              draggable={false}
              height={150}
              loading="eager"
              src="/assets/connect-wallet/tw-welcome-icon.svg"
              style={{
                mixBlendMode: props.theme === "dark" ? "soft-light" : "initial",
              }}
              width={200}
            />
          </div>

          <div className="h-10" />
          <h2
            className="text-center font-semibold text-xl"
            style={{
              color: fontColor,
            }}
          >
            Welcome to thirdweb
          </h2>

          <div className="h-4" />

          <p
            className="text-center font-semibold opacity-80"
            style={{
              color: fontColor,
            }}
          >
            {subtitle}
          </p>
        </div>
      </div>

      <Link
        className="text-center font-semibold opacity-70 hover:no-underline hover:opacity-100"
        href="https://blog.thirdweb.com/web3-wallet/"
        rel="noopener noreferrer"
        style={{
          color: fontColor,
        }}
        target="_blank"
      >
        New to Wallets?
      </Link>
    </div>
  );
}

export function useCustomConnectModal() {
  const { connect } = useConnectModal();
  const { theme } = useTheme();

  return useCallback(
    (options: { chain?: Chain; client: ThirdwebClient }) => {
      return connect({
        appMetadata: {
          logoUrl: "https://thirdweb.com/favicon.ico",
          name: "thirdweb",
          url: "https://thirdweb.com",
        },
        chain: options?.chain,
        client: options.client,
        privacyPolicyUrl: "/privacy-policy",
        showThirdwebBranding: false,
        termsOfServiceUrl: "/terms",
        theme: getSDKTheme(theme === "light" ? "light" : "dark"),
        welcomeScreen: () => (
          <ConnectWalletWelcomeScreen
            theme={theme === "light" ? "light" : "dark"}
          />
        ),
      });
    },
    [connect, theme],
  );
}
