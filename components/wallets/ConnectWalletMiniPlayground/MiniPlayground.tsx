import {
  Box,
  Flex,
  Grid,
  Icon,
  Spacer,
  useBreakpointValue,
  Image,
  Tooltip,
} from "@chakra-ui/react";
import { FormItem } from "../ConnectWalletPlayground/FormItem";
import { ThemeButton } from "../ConnectWalletPlayground/ThemeButton";
import { useState } from "react";
import { ModalSizeButton } from "../ConnectWalletPlayground/ModalSizeButton";
import { ClientOnly } from "components/ClientOnly/ClientOnly";
import {
  ConnectModalInlinePreview,
  useCanShowInlineModal,
} from "../ConnectWalletPlayground/ConnectModalInlinePreview";
import { PreviewThirdwebProvider } from "../ConnectWalletPlayground/PreviewThirdwebProvider";
import { usePlaygroundWallets } from "../ConnectWalletPlayground/usePlaygroundWallets";
import { usePlaygroundTheme } from "../ConnectWalletPlayground/usePlaygroundTheme";
import { Text, Button, Link, Heading, TrackedLink } from "tw-components";
import { MdOutlineElectricBolt } from "react-icons/md";
import {
  walletInfoRecord,
  WalletId,
} from "../ConnectWalletPlayground/walletInfoRecord";
import { replaceIpfsUrl } from "lib/sdk";

import {
  Londrina_Solid as londrinaSolidConstructor,
  Source_Serif_4 as sourceSerif4Constructor,
} from "next/font/google";
import { ChakraNextImage } from "components/Image";
import { FiChevronRight } from "react-icons/fi";
import { useTrack } from "hooks/analytics/useTrack";

// If loading a variable font, you don't need to specify the font weight
const nounsDaoFont = londrinaSolidConstructor({
  subsets: ["latin"],
  weight: ["900", "400"],
});

const web3WarriorsFont = sourceSerif4Constructor({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const MiniPlayground: React.FC<{
  trackingCategory: string;
}> = ({ trackingCategory }) => {
  const [selectedTheme, setSelectedTheme] = useState<"light" | "dark">("dark");
  const { themeObj, setColorOverrides } = usePlaygroundTheme(selectedTheme);

  const isMobile = useBreakpointValue({ base: true, md: false }, { ssr: true });
  const [modalSize, setModalSize] = useState<"compact" | "wide">("wide");

  const { supportedWallets, walletSelection, setWalletSelection } =
    usePlaygroundWallets({
      MetaMask: true,
      Coinbase: true,
      WalletConnect: true,
      Safe: false,
      "Guest Mode": false,
      "Email Wallet": false,
      Trust: true,
      Zerion: true,
      Blocto: false,
      "Magic Link": false,
      Frame: false,
      Rainbow: true,
      Phantom: true,
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
          src={require("public/assets/wallet-playground/nouns-dao-splash.png")}
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
      ></Box>
    );
  }

  let gradientBg: string = "none";
  if (selectedBrand === "default") {
    const darkGradient = `linear-gradient(45deg, hsl(240, 91%, 65%), hsl(280, 91%, 45%) )`;
    const lightGradient = `linear-gradient(45deg, hsl(240, 91%, 75%), hsl(280, 91%, 65%) )`;
    gradientBg = selectedTheme === "light" ? lightGradient : darkGradient;
  } else if (selectedBrand === "nouns-dao") {
    gradientBg = `linear-gradient(45deg, hsl(45, 86%, 54%) , hsl(45, 86%, 84%), hsl(45, 86%, 64%) )`;
  } else if (selectedBrand === "web3-warriors") {
    gradientBg = `linear-gradient(45deg, hsl(188, 79%, 15%), hsl(208, 56%, 13%), hsl(188, 79%, 15%) )`;
  }

  let fontClassName: string | undefined = undefined;
  if (selectedBrand === "nouns-dao") {
    fontClassName = nounsDaoFont.className;
  } else if (selectedBrand === "web3-warriors") {
    fontClassName = web3WarriorsFont.className;
  }

  const trackEvent = useTrack();

  return (
    <Box>
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
                href="/dashboard/connect/playground"
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
              {(Object.keys(walletInfoRecord) as WalletId[])
                .filter((key) => walletInfoRecord[key].type === "social")
                .map((key) => {
                  const walletId = key as WalletId;
                  const walletInfo = walletInfoRecord[walletId];
                  const selection = walletSelection[walletId];

                  const name =
                    walletInfo.component.id === "embeddedWallet"
                      ? "Embedded Wallet"
                      : "Magic Link";

                  const otherSocialWalletId =
                    walletId === "Email Wallet" ? "Magic Link" : "Email Wallet";

                  const getUrl = () => {
                    try {
                      return replaceIpfsUrl(walletInfo.component.meta.iconURL);
                    } catch {
                      return walletInfo.component.meta.iconURL;
                    }
                  };

                  return (
                    <ImageIconButton
                      name={name}
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
                          [otherSocialWalletId]: !selection
                            ? false
                            : walletSelection[otherSocialWalletId],
                        });
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
          minH={["auto", "700px"]}
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
                  href="/dashboard/connect/playground"
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
              bg={`hsl(0deg 0% 0% / 70%)`}
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
                    href="/dashboard/connect/playground"
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
