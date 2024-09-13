"use client";
import { thirdwebClient } from "@/constants/client";
import { getSDKTheme } from "app/components/sdk-component-theme";
import { CustomChainRenderer } from "components/selects/CustomChainRenderer";
import { mapV4ChainToV5Chain } from "contexts/map-chains";
import { useTrack } from "hooks/analytics/useTrack";
import {
  useSupportedChains,
  useSupportedChainsRecord,
} from "hooks/chains/configureChains";
import {
  useAddRecentlyUsedChainId,
  useRecentlyUsedChains,
} from "hooks/chains/recentlyUsedChains";
import { useSetIsNetworkConfigModalOpen } from "hooks/networkConfigModal";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useMemo } from "react";
import type { Chain } from "thirdweb";
import type { LoginPayload } from "thirdweb/auth";
import {
  ConnectButton,
  type SiweAuthOptions,
  useConnectModal,
} from "thirdweb/react";
import type { isLoggedInResponseType } from "../../../../app/api/auth/isloggedin/route";
import { useFavoriteChains } from "../../hooks/useFavoriteChains";
import { popularChains } from "../popularChains";

const dashboardAuth: SiweAuthOptions = {
  async doLogin(params) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      throw new Error("Failed to log in");
    }
  },
  async doLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });
  },
  async getLoginPayload(params) {
    const res = await fetch(
      `/api/auth/get-login-payload?address=${params.address}&chainId=${params.chainId}`,
    );
    const json = (await res.json()) as LoginPayload;
    return json;
  },
  async isLoggedIn(address) {
    const res = await fetch(`/api/auth/isloggedin?address=${address}`);
    const json = (await res.json()) as isLoggedInResponseType;
    return json.isLoggedIn;
  },
};

export const CustomConnectWallet = (props: {
  loginRequired?: boolean;
  connectButtonClassName?: string;
  detailsButtonClassName?: string;
}) => {
  const loginRequired =
    props.loginRequired === undefined ? true : props.loginRequired;
  const { theme } = useTheme();
  const recentChainsv4 = useRecentlyUsedChains();
  const addRecentlyUsedChainId = useAddRecentlyUsedChainId();
  // const setIsNetworkConfigModalOpen = useSetIsNetworkConfigModalOpen();
  const t = theme === "light" ? "light" : "dark";
  const allv4Chains = useSupportedChains();
  const chainsRecord = useSupportedChainsRecord();
  const favChainsQuery = useFavoriteChains();
  const setIsNetworkConfigModalOpen = useSetIsNetworkConfigModalOpen();
  const allChains = useMemo(() => {
    return allv4Chains.map(mapV4ChainToV5Chain);
  }, [allv4Chains]);

  const popularChainsWithMeta = useMemo(() => {
    return popularChains.map((x) => chainsRecord[x.id] || x);
  }, [chainsRecord]);

  const chainSections = useMemo(() => {
    return [
      {
        label: "Favorites",
        chains: favChainsQuery.data.map(mapV4ChainToV5Chain),
      },
      {
        label: "Popular",
        chains: popularChainsWithMeta.map(mapV4ChainToV5Chain),
      },
      {
        label: "Recent",
        chains: recentChainsv4.map(mapV4ChainToV5Chain),
      },
    ];
  }, [recentChainsv4, favChainsQuery.data, popularChainsWithMeta]);

  return (
    <ConnectButton
      theme={getSDKTheme(t)}
      client={thirdwebClient}
      connectModal={{
        privacyPolicyUrl: "/privacy",
        termsOfServiceUrl: "/tos",
        showThirdwebBranding: false,
        welcomeScreen: () => <ConnectWalletWelcomeScreen theme={t} />,
      }}
      appMetadata={{
        name: "thirdweb",
        logoUrl: "https://thirdweb.com/favicon.ico",
        url: "https://thirdweb.com",
      }}
      onDisconnect={async () => {
        try {
          // log out the user
          await fetch("/api/auth/logout", {
            method: "POST",
          });
        } catch (err) {
          console.error("Failed to log out", err);
        }
      }}
      connectButton={{
        className: props.connectButtonClassName,
      }}
      detailsButton={{
        className: props.detailsButtonClassName,
      }}
      chains={allChains}
      detailsModal={{
        networkSelector: {
          sections: chainSections,
          onSwitch(chain) {
            addRecentlyUsedChainId(chain.id);
          },
          renderChain: CustomChainRenderer,
          onCustomClick: () => {
            setIsNetworkConfigModalOpen(true);
          },
        },
      }}
      auth={loginRequired ? dashboardAuth : undefined}
    />
  );
};

export function ConnectWalletWelcomeScreen(props: {
  theme: "light" | "dark";
  subtitle?: string;
}) {
  const fontColor = props.theme === "light" ? "black" : "white";
  const subtitle = props.subtitle ?? "Connect your wallet to get started";

  return (
    <div
      style={{
        backgroundColor: props.theme === "dark" ? "#18132f" : "#c7b5f1",
        backgroundImage: `url("/assets/connect-wallet/welcome-gradient-${props.theme}.png")`,
      }}
      className="flex flex-col p-6 h-full bg-cover bg-center bg-no-repeat"
    >
      <div className="flex flex-grow flex-col justify-center">
        <div>
          <div className="flex justify-center">
            <Image
              className="select-none"
              style={{
                mixBlendMode: props.theme === "dark" ? "soft-light" : "initial",
              }}
              draggable={false}
              width={200}
              height={150}
              alt=""
              src="/assets/connect-wallet/tw-welcome-icon.svg"
              loading="eager"
            />
          </div>

          <div className="h-10" />
          <h2
            className="text-xl text-center font-semibold"
            style={{
              color: fontColor,
            }}
          >
            Welcome to thirdweb
          </h2>

          <div className="h-4" />

          <p
            className="text-center opacity-80 font-semibold"
            style={{
              color: fontColor,
            }}
          >
            {subtitle}
          </p>
        </div>
      </div>

      <TrackedAnchorLink
        className="text-center font-semibold opacity-70 hover:opacity-100 hover:no-underline"
        target="_blank"
        category="custom-connect-wallet"
        label="new-to-wallets"
        href="https://blog.thirdweb.com/web3-wallet/"
        style={{
          color: fontColor,
        }}
      >
        New to Wallets?
      </TrackedAnchorLink>
    </div>
  );
}

export function useCustomConnectModal() {
  const { connect } = useConnectModal();
  const { theme } = useTheme();

  return useCallback(
    (options: { chain?: Chain; dismissible: boolean }) => {
      return connect({
        client: thirdwebClient,
        appMetadata: {
          name: "thirdweb",
          logoUrl: "https://thirdweb.com/favicon.ico",
          url: "https://thirdweb.com",
        },
        chain: options.chain,
        privacyPolicyUrl: "/privacy",
        termsOfServiceUrl: "/tos",
        showThirdwebBranding: false,
        dismissible: options.dismissible,
        auth: dashboardAuth,
        welcomeScreen: () => (
          <ConnectWalletWelcomeScreen
            theme={theme === "light" ? "light" : "dark"}
          />
        ),
        theme: getSDKTheme(theme === "light" ? "light" : "dark"),
      });
    },
    [connect, theme],
  );
}

/**
 * A link component extends the `Link` component and adds tracking.
 */
function TrackedAnchorLink(props: {
  category: string;
  label?: string;
  trackingProps?: Record<string, string>;
  href: string;
  target?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const trackEvent = useTrack();
  const { category, label, trackingProps } = props;

  const onClick = useCallback(() => {
    trackEvent({ category, action: "click", label, ...trackingProps });
  }, [trackEvent, category, label, trackingProps]);

  return (
    <Link
      onClick={onClick}
      target={props.target}
      href={props.href}
      className={props.className}
      style={props.style}
    >
      {props.children}
    </Link>
  );
}
