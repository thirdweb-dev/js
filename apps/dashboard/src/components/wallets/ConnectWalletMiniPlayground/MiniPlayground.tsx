"use client";

/* eslint-disable @next/next/no-img-element */

import { Checkbox } from "@/components/ui/checkbox";
import { getThirdwebClient } from "@/constants/thirdweb.server";
import {
  Box,
  Flex,
  Grid,
  Image,
  Spacer,
  Tooltip,
  useBreakpointValue,
} from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { useTrack } from "hooks/analytics/useTrack";
import { ChevronRightIcon } from "lucide-react";
import { Londrina_Solid, Source_Serif_4 } from "next/font/google";
import { useEffect, useMemo, useState } from "react";
import {
  ConnectEmbed,
  ThirdwebProvider,
  useActiveWallet,
  useDisconnect,
  useWalletImage,
  useWalletInfo,
} from "thirdweb/react";
import {
  type InAppWalletAuth,
  type Wallet,
  type WalletId,
  createWallet,
  inAppWallet,
} from "thirdweb/wallets";
import { TrackedLink } from "tw-components";
import { FormItem } from "../ConnectWalletPlayground/FormItem";
import { ModalSizeButton } from "../ConnectWalletPlayground/ModalSizeButton";
import { ThemeButton } from "../ConnectWalletPlayground/ThemeButton";
import { usePlaygroundTheme } from "../ConnectWalletPlayground/usePlaygroundTheme";

// If loading a variable font, you don't need to specify the font weight
const nounsDaoFont = Londrina_Solid({
  subsets: ["latin"],
  weight: ["900", "400"],
  display: "swap",
});

const web3WarriorsFont = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

type WalletIdSubset =
  | "io.metamask"
  | "com.coinbase.wallet"
  | "me.rainbow"
  | "io.rabby"
  | "io.zerion.wallet";
type WalletRecord = Record<WalletIdSubset, boolean>;

function usePlaygroundWallets() {
  const [socialOptions, setSocialOptions] = useState<
    Record<InAppWalletAuth, boolean>
  >({
    line: false,
    x: true,
    google: true,
    discord: true,
    telegram: true,
    farcaster: true,
    email: true,
    passkey: true,
    phone: true,
    twitch: false,
    steam: false,
    facebook: false,
    apple: false,
    github: false,
    coinbase: false,
    guest: false,
    wallet: false,
  });

  const [enabledWallets, setEnabledWallets] = useState<WalletRecord>({
    "io.metamask": true,
    "com.coinbase.wallet": true,
    "me.rainbow": true,
    "io.rabby": true,
    "io.zerion.wallet": true,
  });

  const wallets = useMemo(() => {
    const _wallets: Wallet[] = (Object.keys(enabledWallets) as WalletIdSubset[])
      .filter((k) => enabledWallets[k])
      .map((w) => createWallet(w));

    const isSocialEnabled = Object.values(socialOptions).some((v) => v);

    if (isSocialEnabled) {
      _wallets.push(
        inAppWallet({
          auth: {
            options: (Object.keys(socialOptions) as InAppWalletAuth[]).filter(
              (k) => socialOptions[k],
            ),
          },
        }),
      );
    }

    return _wallets;
  }, [socialOptions, enabledWallets]);

  return {
    setSocialOptions,
    enabledWallets,
    setEnabledWallets,
    wallets,
    socialOptions,
  };
}

export const MiniPlayground: React.FC<{
  trackingCategory: string;
}> = ({ trackingCategory }) => {
  const [selectedTheme, setSelectedTheme] = useState<"light" | "dark">("dark");
  const { themeObj, setColorOverrides } = usePlaygroundTheme(selectedTheme);

  const isMobile = useBreakpointValue({ base: true, md: false }, { ssr: true });
  const [modalSize, setModalSize] = useState<"compact" | "wide">("wide");

  const {
    enabledWallets,
    setEnabledWallets,
    wallets,
    socialOptions,
    setSocialOptions,
  } = usePlaygroundWallets();

  const [modalTitle, setModalTitle] = useState<string | undefined>();
  const [modalTitleIconUrl, setModalTitleIconUrl] = useState<
    string | undefined
  >();

  const [selectedBrand, setSelectedBrand] = useState<
    "default" | "web3-warriors" | "nouns-dao"
  >("default");

  let customWelcomeScreen: (() => React.ReactNode) | undefined = undefined;
  if (selectedBrand === "nouns-dao") {
    customWelcomeScreen = () => (
      <Box bg="#E9C80B" h="full" px={3} pt={3}>
        <ChakraNextImage
          width={614}
          height={857}
          alt="Nouns Dao"
          src={require("../../../../public/assets/wallet-playground/nouns-dao-splash.png")}
          w="100%"
          h="auto"
        />
      </Box>
    );
  } else if (selectedBrand === "web3-warriors") {
    customWelcomeScreen = () => (
      <Box
        h="full"
        px={3}
        pt={3}
        backgroundImage={`linear-gradient(to right, #131418, transparent), url("/assets/wallet-playground/web3-warriors-splash.png")`}
        backgroundSize="150px, cover"
        backgroundRepeat="no-repeat"
        backgroundPosition="left, center"
      />
    );
  }

  let gradientBg = "none";
  if (selectedBrand === "default") {
    const darkGradient =
      "linear-gradient(45deg, hsl(240, 91%, 65%), hsl(280, 91%, 45%) )";
    const lightGradient =
      "linear-gradient(45deg, hsl(240, 91%, 75%), hsl(280, 91%, 65%) )";
    gradientBg = selectedTheme === "light" ? lightGradient : darkGradient;
  } else if (selectedBrand === "nouns-dao") {
    gradientBg =
      "linear-gradient(45deg, hsl(45, 86%, 54%) , hsl(45, 86%, 84%), hsl(45, 86%, 64%) )";
  } else if (selectedBrand === "web3-warriors") {
    gradientBg =
      "linear-gradient(45deg, hsl(188, 79%, 15%), hsl(208, 56%, 13%), hsl(188, 79%, 15%) )";
  }

  let fontClassName: string | undefined = undefined;
  if (selectedBrand === "nouns-dao") {
    fontClassName = nounsDaoFont.className;
  } else if (selectedBrand === "web3-warriors") {
    fontClassName = web3WarriorsFont.className;
  }

  const trackEvent = useTrack();

  return (
    <ThirdwebProvider>
      <DisconnectWallet />
      <Box w="full">
        <Grid templateColumns={["1fr", "300px 1fr"]} gap={5}>
          {/* Left */}
          <Flex flexDir="column" gap={10} order={[1, 0]}>
            {/* Theme */}
            <FormItem label="Theme">
              <div className="flex flex-row gap-2">
                <ThemeButton
                  trackingCategory={trackingCategory}
                  theme="dark"
                  isSelected={selectedTheme === "dark"}
                  onClick={() => {
                    setSelectedTheme("dark");
                    setSelectedBrand("default");
                  }}
                />

                <ThemeButton
                  trackingCategory={trackingCategory}
                  theme="light"
                  isSelected={selectedTheme === "light"}
                  onClick={() => {
                    setSelectedTheme("light");
                    setSelectedBrand("default");
                  }}
                />
              </div>
            </FormItem>

            {/* modal size */}
            {!isMobile && (
              <FormItem label="Modal Size">
                <div className="flex flex-row gap-2">
                  <ModalSizeButton
                    trackingCategory={trackingCategory}
                    theme={selectedTheme}
                    modalSize="wide"
                    isSelected={modalSize === "wide"}
                    onClick={() => {
                      setModalSize("wide");
                    }}
                  />

                  <ModalSizeButton
                    trackingCategory={trackingCategory}
                    theme={selectedTheme}
                    modalSize="compact"
                    isSelected={modalSize === "compact"}
                    onClick={() => {
                      setModalSize("compact");
                    }}
                  />
                </div>
              </FormItem>
            )}

            {/* Web3 Wallets */}
            <div>
              <FormItem label="Web3 Wallets">
                <Flex flexWrap="wrap" gap={3}>
                  {(Object.keys(enabledWallets) as WalletIdSubset[]).map(
                    (walletId) => {
                      const isSelected = enabledWallets[walletId];
                      return (
                        <WalletIconButton
                          key={walletId}
                          isSelected={isSelected}
                          walletId={walletId}
                          onClick={() => {
                            setEnabledWallets((v) => ({
                              ...v,
                              [walletId]: !isSelected,
                            }));
                          }}
                        />
                      );
                    },
                  )}
                </Flex>
              </FormItem>
              <Spacer h={3} />

              <Flex alignItems="center" gap={1}>
                <TrackedLink
                  href="https://playground.thirdweb.com/connect/sign-in/button"
                  color="blue.500"
                  category={trackingCategory}
                  label="see-all-wallets"
                >
                  See all wallets
                </TrackedLink>
                <ChevronRightIcon className="size-4 text-blue-500" />
              </Flex>
            </div>

            {/* Social Logins */}
            <FormItem label="Email & Social Logins">
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(socialOptions).map((_key) => {
                  const key = _key as InAppWalletAuth;
                  return (
                    <label
                      key={key}
                      htmlFor={key}
                      className="flex items-center gap-2"
                    >
                      <Checkbox
                        id={key}
                        checked={socialOptions[key]}
                        onCheckedChange={(checked) => {
                          setSocialOptions((v) => ({
                            ...v,
                            [key]: checked,
                          }));
                        }}
                      />
                      <span className="capitalize">{key}</span>
                    </label>
                  );
                })}
              </div>
            </FormItem>

            {/* Brand */}
            <FormItem label="Brand">
              <Flex flexWrap="wrap" gap={3}>
                {/* Default */}
                <ImageIconButton
                  iconUrl="/assets/wallet-playground/tw-app-icon.png"
                  name="Default"
                  isSelected={selectedBrand === "default"}
                  onClick={() => {
                    setSelectedBrand("default");
                    setModalTitle(undefined);
                    setModalTitleIconUrl(undefined);
                    setColorOverrides({});
                    setModalSize("wide");

                    trackEvent({
                      action: "click",
                      category: trackingCategory,
                      label: "brand",
                      brand: "default",
                    });
                  }}
                />

                <ImageIconButton
                  iconUrl="/assets/wallet-playground/nouns-dao-app-icon.png"
                  name="Nouns Dao"
                  isSelected={selectedBrand === "nouns-dao"}
                  onClick={() => {
                    setSelectedBrand("nouns-dao");
                    setSelectedTheme("light");
                    setModalTitle("Welcome to Nouns Dao");
                    setModalTitleIconUrl(
                      "/assets/wallet-playground/nouns-dao-tiny-icon.svg",
                    );
                    setColorOverrides({
                      borderColor: "#E9C80B",
                    });
                    setModalSize("wide");

                    trackEvent({
                      action: "click",
                      category: trackingCategory,
                      label: "brand",
                      brand: "nouns-dao",
                    });
                  }}
                />

                <ImageIconButton
                  iconUrl="/assets/wallet-playground/web3-warriors-app-icon.png"
                  name="Web3 Warriors"
                  isSelected={selectedBrand === "web3-warriors"}
                  onClick={() => {
                    setSelectedBrand("web3-warriors");
                    setSelectedTheme("dark");
                    setModalTitle("WEB3 WARRIORS");
                    setModalTitleIconUrl("/assets/wallet-playground/w3w.svg");
                    setColorOverrides({});
                    setModalSize("wide");

                    trackEvent({
                      action: "click",
                      category: trackingCategory,
                      label: "brand",
                      brand: "web3-warriors",
                    });
                  }}
                />
              </Flex>
            </FormItem>
          </Flex>

          {/* right */}
          <Box
            background={["none", gradientBg]}
            p={10}
            height={["auto", "700px"]}
            role="group"
            position="relative"
            borderRadius="lg"
            overflow="hidden"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Box className={fontClassName}>
              <ConnectEmbed
                wallets={wallets}
                client={getThirdwebClient()}
                header={{
                  title: modalTitle,
                  titleIcon: modalTitleIconUrl,
                }}
                theme={themeObj}
                modalSize={modalSize}
                welcomeScreen={customWelcomeScreen}
              />
            </Box>
          </Box>
        </Grid>
      </Box>
    </ThirdwebProvider>
  );
};

function ImageIconButton(props: {
  name: string;
  onClick: () => void;
  iconUrl: string;
  isSelected: boolean;
}) {
  return (
    <Tooltip label={props.name} placement="top">
      <Box
        userSelect="none"
        role="button"
        cursor="pointer"
        aria-label={props.name}
        onClick={props.onClick}
        opacity={props.isSelected ? 1 : 0.2}
        filter={props.isSelected ? "none" : "grayscale(0.5)"}
        transition="opacity 200ms ease"
      >
        <Image width={14} height={14} alt={props.name} src={props.iconUrl} />
      </Box>
    </Tooltip>
  );
}

function WalletIconButton(props: {
  walletId: WalletId;
  onClick: () => void;
  isSelected: boolean;
}) {
  const imgQuery = useWalletImage(props.walletId);
  const walletInfo = useWalletInfo(props.walletId);
  const walletName = walletInfo.data ? walletInfo.data.name : props.walletId;

  return (
    <Tooltip label={walletName} placement="top">
      <Box
        userSelect="none"
        role="button"
        cursor="pointer"
        aria-label={walletName}
        onClick={props.onClick}
        opacity={props.isSelected ? 1 : 0.2}
        filter={props.isSelected ? "none" : "grayscale(0.5)"}
        transition="opacity 200ms ease"
        className="rounded-lg border border-border"
      >
        <Image
          width={14}
          height={14}
          alt=""
          src={imgQuery.data}
          className="rounded-lg"
        />
      </Box>
    </Tooltip>
  );
}

function DisconnectWallet() {
  const wallet = useActiveWallet();
  const { disconnect } = useDisconnect();

  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (wallet) {
      disconnect(wallet);
    }
  }, [wallet, disconnect]);

  return null;
}
