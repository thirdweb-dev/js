import {
  Box,
  Flex,
  Grid,
  Icon,
  Image,
  Spacer,
  Tooltip,
  useBreakpointValue,
} from "@chakra-ui/react";
import { ClientOnly } from "components/ClientOnly/ClientOnly";
import { ChakraNextImage } from "components/Image";
import { useTrack } from "hooks/analytics/useTrack";
import { replaceIpfsUrl } from "lib/sdk";
import {
  Londrina_Solid as londrinaSolidConstructor,
  Source_Serif_4 as sourceSerif4Constructor,
} from "next/font/google";
import { useState } from "react";
import { FiChevronRight } from "react-icons/fi";
import { MdOutlineElectricBolt } from "react-icons/md";
import { Button, Heading, Link, Text, TrackedLink } from "tw-components";
import {
  ConnectModalInlinePreview,
  useCanShowInlineModal,
} from "../ConnectWalletPlayground/ConnectModalInlinePreview";
import { FormItem } from "../ConnectWalletPlayground/FormItem";
import { ModalSizeButton } from "../ConnectWalletPlayground/ModalSizeButton";
import { PreviewThirdwebProvider } from "../ConnectWalletPlayground/PreviewThirdwebProvider";
import { ThemeButton } from "../ConnectWalletPlayground/ThemeButton";
import { usePlaygroundTheme } from "../ConnectWalletPlayground/usePlaygroundTheme";
import { usePlaygroundWallets } from "../ConnectWalletPlayground/usePlaygroundWallets";
import {
  type WalletId,
  walletInfoRecord,
} from "../ConnectWalletPlayground/walletInfoRecord";

const phoneIcon =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzM1ODlfODYwMikiPgo8cmVjdCB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHJ4PSI4IiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMzU4OV84NjAyKSIvPgo8cmVjdCB4PSItMSIgeT0iLTEiIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgcng9IjkuOCIgZmlsbD0idXJsKCNwYWludDFfbGluZWFyXzM1ODlfODYwMikiLz4KPHBhdGggZD0iTTE4Ljg2MjIgMjYuODY0NkwxOS41MTk0IDI3LjUxODlDMTkuNTE5NCAyNy41MTg5IDIxLjA4MzcgMjkuMDczMSAyNS4zNTIxIDI0LjgyOTNDMjkuNjIwNSAyMC41ODU1IDI4LjA1NjEgMTkuMDMxMyAyOC4wNTYxIDE5LjAzMTNMMjcuNjQzIDE4LjYxODFDMjYuNjIxOCAxNy42MDQxIDI2LjUyNSAxNS45NzQ4IDI3LjQxNjIgMTQuNzg0NkwyOS4yMzYyIDEyLjM1MzVDMzAuMzM5OCAxMC44ODAyIDMyLjQ3MDQgMTAuNjg1MiAzMy43MzQzIDExLjk0MTlMMzYuMDAyMSAxNC4xOTUyQzM2LjYyNzUgMTQuODE5MiAzNy4wNDY0IDE1LjYyNTIgMzYuOTk1OSAxNi41MjA4QzM2Ljg2NTkgMTguODEzMSAzNS44Mjg4IDIzLjc0MzEgMzAuMDQ1MSAyOS40OTQ5QzIzLjkxMDUgMzUuNTkzNCAxOC4xNTQ0IDM1LjgzNjEgMTUuODAxNCAzNS42MTY1QzE1LjA1NiAzNS41NDcyIDE0LjQwODkgMzUuMTY4NyAxMy44ODc0IDM0LjY0ODdMMTEuODM2MyAzMi42MDkyQzEwLjQ0OTYgMzEuMjMyNiAxMC44Mzk2IDI4Ljg3MDkgMTIuNjEzNCAyNy45MDc0TDE1LjM3MjMgMjYuNDA2N0MxNi41MzY2IDI1Ljc3NCAxNy45NTIxIDI1Ljk2MDMgMTguODYyMiAyNi44NjQ2WiIgZmlsbD0id2hpdGUiLz4KPC9nPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzM1ODlfODYwMiIgeDE9IjI1LjUiIHkxPSItNi4yOTU3MmUtMDYiIHgyPSIzMC4yMDE2IiB5Mj0iNDcuNTM1IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiM4MzU4QkEiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjN0IxQ0Y3Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQxX2xpbmVhcl8zNTg5Xzg2MDIiIHgxPSIyNS41NjI1IiB5MT0iLTEuMDAwMDEiIHgyPSIzMC40NiIgeTI9IjQ4LjUxNTYiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzgzNThCQSIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM3QjFDRjciLz4KPC9saW5lYXJHcmFkaWVudD4KPGNsaXBQYXRoIGlkPSJjbGlwMF8zNTg5Xzg2MDIiPgo8cmVjdCB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHJ4PSI4IiBmaWxsPSJ3aGl0ZSIvPgo8L2NsaXBQYXRoPgo8L2RlZnM+Cjwvc3ZnPgo=";

const socialIconMapV2 = {
  email: "/assets/connect/email.png",
  google: "assets/connect/google.png",
  facebook: "assets/connect/facebook.png",
  apple: "assets/connect/apple.png",
  phone: phoneIcon,
};

// If loading a variable font, you don't need to specify the font weight
const nounsDaoFont = londrinaSolidConstructor({
  subsets: ["latin"],
  weight: ["900", "400"],
});

const web3WarriorsFont = sourceSerif4Constructor({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

function addOrRemoveFromList<T>(list: T[], item: T) {
  if (list.includes(item)) {
    return list.filter((x) => x !== item);
  }
  return [...list, item];
}

export const MiniPlayground: React.FC<{
  trackingCategory: string;
}> = ({ trackingCategory }) => {
  const [selectedTheme, setSelectedTheme] = useState<"light" | "dark">("dark");
  const { themeObj, setColorOverrides } = usePlaygroundTheme(selectedTheme);

  const isMobile = useBreakpointValue({ base: true, md: false }, { ssr: true });
  const [modalSize, setModalSize] = useState<"compact" | "wide">("wide");

  const {
    supportedWallets,
    walletSelection,
    setWalletSelection,
    socialOptions,
    setSocialOptions,
  } = usePlaygroundWallets({
    MetaMask: true,
    Coinbase: "recommended",
    WalletConnect: true,
    // Safe: false,
    // "Guest Mode": true,
    "Email Wallet": true,
    Trust: false,
    Zerion: false,
    // Blocto: false,
    // "Magic Link": false,
    // Frame: false,
    Rainbow: false,
    Phantom: false,
  });
  const walletIds = supportedWallets.map((x) => x.id) as WalletId[];
  const canShowInlineModal = useCanShowInlineModal(walletIds);

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

  const socialLoginMethods = [
    {
      name: "Sign in with Email",
      key: "email",
    },
    {
      name: "Sign in with phone number",
      key: "phone",
    },
    {
      name: "Sign in with Google",
      key: "google",
    },
    {
      name: "Sign in with Apple",
      key: "apple",
    },
    {
      name: "Sign in with Facebook",
      key: "facebook",
    },
  ] as const;

  const trackCustomize = (input: string, data: Record<string, string> = {}) => {
    trackEvent({
      action: "click",
      category: trackingCategory,
      label: "customize",
      input,
      ...data,
    });
  };

  return (
    <Box w="full">
      <Grid templateColumns={["1fr", "300px 1fr"]} gap={5}>
        {/* Left */}
        <Flex flexDir="column" gap={10} order={[1, 0]}>
          {/* Theme */}
          <FormItem label="Theme">
            <Flex gap={2}>
              <ThemeButton
                trackingCategory={trackingCategory}
                disabled={selectedBrand !== "default"}
                theme="dark"
                isSelected={selectedTheme === "dark"}
                onClick={() => {
                  setSelectedTheme("dark");
                }}
              />

              <ThemeButton
                trackingCategory={trackingCategory}
                disabled={selectedBrand !== "default"}
                theme="light"
                isSelected={selectedTheme === "light"}
                onClick={() => {
                  setSelectedTheme("light");
                }}
              />
            </Flex>
          </FormItem>

          {/* modal size */}
          {!isMobile && (
            <FormItem label="Modal Size">
              <Flex gap={2}>
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
              </Flex>
            </FormItem>
          )}

          {/* Web3 Wallets */}
          <Box>
            <FormItem label="Web3 Wallets">
              <Flex flexWrap="wrap" gap={3}>
                {(Object.keys(walletInfoRecord) as WalletId[])
                  .filter((key) => walletInfoRecord[key].type === "eoa")
                  .slice(0, 8)
                  .map((key) => {
                    const walletId = key as WalletId;
                    const walletInfo = walletInfoRecord[walletId];
                    const selection = walletSelection[walletId];

                    const getUrl = () => {
                      try {
                        return replaceIpfsUrl(
                          walletInfo.component.meta.iconURL,
                        );
                      } catch {
                        return walletInfo.component.meta.iconURL;
                      }
                    };

                    return (
                      <ImageIconButton
                        name={walletInfo.component.meta.name}
                        iconUrl={getUrl()}
                        isSelected={!!selection}
                        key={walletInfo.component.id}
                        onClick={() => {
                          trackEvent({
                            action: "click",
                            category: trackingCategory,
                            label: "wallet",
                            walletName: walletInfo.component.meta.name,
                          });
                          setWalletSelection({
                            ...walletSelection,
                            [walletId]: !selection,
                          });
                        }}
                      />
                    );
                  })}
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
              <Icon as={FiChevronRight} w={4} h={4} color="blue.500" />
            </Flex>
          </Box>

          {/* Social Logins */}
          <FormItem label="Email & Social Logins">
            <Flex flexWrap="wrap" gap={3}>
              {socialLoginMethods.map((x) => {
                const icon = socialIconMapV2[x.key];
                return (
                  <ImageIconButton
                    name={x.name}
                    iconUrl={icon}
                    isSelected={socialOptions.includes(x.key)}
                    key={x.key}
                    onClick={() => {
                      trackCustomize("socialLogin", {
                        option: x.key,
                      });

                      // do not allow to unselect all
                      if (
                        socialOptions.length === 1 &&
                        socialOptions[0] === x.key
                      ) {
                        return;
                      }
                      setSocialOptions(
                        addOrRemoveFromList(socialOptions, x.key),
                      );
                    }}
                  />
                );
              })}
            </Flex>
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
          {/* Can not show Modal */}
          {!canShowInlineModal && (
            <Flex
              h="full"
              flexDir="column"
              justifyContent="center"
              alignItems="center"
              p={3}
            >
              <Box textAlign="center">
                <Spacer h={4} />
                <Text
                  maxW="400px"
                  color={selectedTheme === "light" ? "black" : "white"}
                  fontSize={16}
                >
                  Can not show Modal UI preview for this configuration because
                  it triggers wallet connection
                </Text>
                <Spacer h={5} />

                <Text
                  color={selectedTheme === "light" ? "black" : "white"}
                  fontSize={16}
                >
                  See Live Preview Instead
                </Text>

                <Spacer h={10} />

                <Button
                  as={Link}
                  href="https://playground.thirdweb.com/connect/sign-in/button"
                  fontSize={20}
                  leftIcon={<Icon as={MdOutlineElectricBolt} />}
                  color="black"
                  textDecor="none"
                  p={7}
                  bg="white"
                  _hover={{
                    bg: "white",
                    color: "black",
                    textDecor: "none",
                  }}
                >
                  Live Preview
                </Button>
              </Box>
            </Flex>
          )}

          {/* Hover overlay */}
          {canShowInlineModal && (
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bg={"hsl(0deg 0% 0% / 70%)"}
              zIndex={100}
              opacity={0}
              transition="opacity 200ms ease"
              _hover={{
                opacity: 1,
                backdropFilter: "blur(10px)",
              }}
            >
              <Flex
                h="full"
                flexDir="column"
                justifyContent="center"
                alignItems="center"
                p={3}
              >
                <Box textAlign="center">
                  <Heading fontSize={32} color={"white"}>
                    See thirdweb Connect in action
                  </Heading>
                  <Spacer h={4} />
                  <Text color={"white"} fontSize={16}>
                    Create a powerful Connect Wallet experience for your app.
                  </Text>
                  <Spacer h={10} />
                  <Button
                    as={TrackedLink}
                    category={trackingCategory}
                    label="build-your-own"
                    href="https://playground.thirdweb.com/connect/sign-in/button"
                    fontSize={20}
                    leftIcon={<Icon as={MdOutlineElectricBolt} />}
                    color="black"
                    textDecor="none"
                    p={7}
                    bg="white"
                    _hover={{
                      bg: "white",
                      color: "black",
                      textDecor: "none",
                    }}
                  >
                    Build your own
                  </Button>
                </Box>
              </Flex>
            </Box>
          )}

          <Box className={fontClassName}>
            {canShowInlineModal && (
              <PreviewThirdwebProvider
                authEnabled={false}
                supportedWallets={supportedWallets}
              >
                <ClientOnly
                  ssr={null}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <ConnectModalInlinePreview
                    modalSize={modalSize}
                    walletIds={supportedWallets.map((x) => x.id) as WalletId[]}
                    theme={themeObj}
                    welcomeScreen={customWelcomeScreen}
                    modalTitle={modalTitle}
                    modalTitleIconUrl={modalTitleIconUrl}
                  />
                </ClientOnly>
              </PreviewThirdwebProvider>
            )}
          </Box>
        </Box>
      </Grid>
    </Box>
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
        <Image
          width={14}
          height={14}
          alt={props.name}
          src={replaceIpfsUrl(props.iconUrl)}
        />
      </Box>
    </Tooltip>
  );
}
