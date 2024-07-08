"use client";

import { thirdwebClient } from "@/constants/client";
import { useSupportedChains } from "@thirdweb-dev/react";
import { useTrack } from "hooks/analytics/useTrack";
import {
  useAddRecentlyUsedChainId,
  useRecentlyUsedChains,
} from "hooks/chains/recentlyUsedChains";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useMemo } from "react";
import { defineChain } from "thirdweb";
import { ConnectButton } from "thirdweb/react";
import { useFavoriteChains } from "../../hooks/useFavoriteChains";
import { useLoggedInUser } from "../../hooks/useLoggedInUser";
import { popularChains } from "../popularChains";

export const CustomConnectWallet: React.FC = () => {
  const { theme } = useTheme();
  const recentChainsv4 = useRecentlyUsedChains();
  const addRecentlyUsedChainId = useAddRecentlyUsedChainId();
  // const setIsNetworkConfigModalOpen = useSetIsNetworkConfigModalOpen();
  const t = theme === "light" ? "light" : "dark";
  const allv4Chains = useSupportedChains();
  const favChainsQuery = useFavoriteChains();

  const allChains = useMemo(() => {
    return allv4Chains.map((c) => defineChain(c));
  }, [allv4Chains]);

  const chainSections = useMemo(() => {
    return [
      {
        label: "Favorites",
        chains: favChainsQuery.data.map(defineChain),
      },
      {
        label: "Popular",
        chains: popularChains.map(defineChain),
      },
      {
        label: "Recent",
        chains: recentChainsv4.map(defineChain),
      },
    ];
  }, [recentChainsv4, favChainsQuery.data]);

  // ensures login status on pages that need it
  useLoggedInUser();

  return (
    <ConnectButton
      theme={t}
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
      chains={allChains}
      detailsModal={{
        networkSelector: {
          sections: chainSections,
          onSwitch(chain) {
            addRecentlyUsedChainId(chain.id);
          },
          // TODO: bring this back when it works reliably
          // renderChain: CustomChainRenderer,
        },
      }}
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
