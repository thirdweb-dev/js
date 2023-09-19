import {
  Box,
  Flex,
  FormControl,
  GridItem,
  Input,
  Select,
  Image,
  Tooltip,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  Grid,
  useBreakpointValue,
  Switch,
  useColorMode,
} from "@chakra-ui/react";
import {
  ConnectWallet,
  ThirdwebProvider,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
  safeWallet,
  WalletConfig,
  smartWallet,
  localWallet,
  paperWallet,
  trustWallet,
  zerionWallet,
  magicLink,
  phantomWallet,
  bloctoWallet,
  frameWallet,
  rainbowWallet,
  ConnectModalInline,
  useDisconnect,
  useConnectionStatus,
} from "@thirdweb-dev/react";
import React, { useEffect, useState } from "react";
import { Button, CodeBlock, FormLabel, Text } from "tw-components";
import { replaceIpfsUrl } from "lib/sdk";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { THIRDWEB_DOMAIN, THIRDWEB_API_HOST } from "constants/urls";
import { format } from "prettier/standalone";
import parserBabel from "prettier/plugins/babel";
import estree from "prettier/plugins/estree";
import { ClientOnly } from "components/ClientOnly/ClientOnly";
import styles from "./styles.module.css";

type Theme = "light" | "dark";
type WalletId =
  | "MetaMask"
  | "Coinbase"
  | "WalletConnect"
  | "Safe"
  | "Smart Wallet"
  | "Guest Mode"
  | "Email Wallet"
  | "Trust Wallet"
  | "Zerion Wallet"
  | "Magic Link"
  | "Blocto Wallet"
  | "Frame Wallet"
  | "Rainbow Wallet"
  | "Phantom";
type WalletInfo = Record<
  WalletId,
  {
    code: string;
    component: WalletConfig<any>;
    import: string;
  }
>;

type WalletSetupOptions = {
  imports: string[];
  thirdwebProvider: {
    supportedWallets?: string;
    authConfig?: string;
  };
  connectWallet: {
    theme?: string;
    btnTitle?: string;
    auth?: string;
    modalTitle?: string;
    switchToActiveChain?: string;
    modalSize?: string;
  };
};

const metamaskWalletConfig = metamaskWallet();
const walletConnectConfig = walletConnect();
const coinbaseWalletConfig = coinbaseWallet();
const bloctoWalletConfig = bloctoWallet();
const frameWalletConfig = frameWallet();
const trustWalletConfig = trustWallet();
const rainbowWalletConfig = rainbowWallet();

const zerionWalletConfig = zerionWallet();
const phantomConfig = phantomWallet();

const hideUIForWalletIds = new Set([
  metamaskWalletConfig.id,
  coinbaseWalletConfig.id,
  walletConnectConfig.id,
  bloctoWalletConfig.id,
  frameWalletConfig.id,
  phantomConfig.id,
]);

const hideUIForWalletIdsMobile = new Set([
  zerionWalletConfig.id,
  rainbowWalletConfig.id,
  trustWalletConfig.id,
]);

const wallets: WalletInfo = {
  MetaMask: {
    code: "metamaskWallet()",
    component: metamaskWalletConfig,
    import: "metamaskWallet",
  },
  Coinbase: {
    code: "coinbaseWallet()",
    component: coinbaseWalletConfig,
    import: "coinbaseWallet",
  },
  WalletConnect: {
    code: "walletConnect()",
    component: walletConnectConfig,
    import: "walletConnect",
  },
  "Trust Wallet": {
    code: `trustWallet()`,
    component: trustWalletConfig,
    import: "trustWallet",
  },
  "Rainbow Wallet": {
    code: `rainbowWallet()`,
    component: rainbowWalletConfig,
    import: "rainbowWallet",
  },

  "Zerion Wallet": {
    code: "zerionWallet()",
    component: zerionWalletConfig,
    import: "zerionWallet",
  },
  Phantom: {
    code: "phantomWallet()",
    component: phantomConfig,
    import: "phantomWallet",
  },
  "Guest Mode": {
    code: `localWallet()`,
    component: localWallet(),
    import: "localWallet",
  },
  "Email Wallet": {
    code: `paperWallet()`,
    component: paperWallet({
      paperClientId: "9a2f6238-c441-4bf4-895f-d13c2faf2ddb",
    }),
    import: "paperWallet",
  },
  Safe: {
    code: `safeWallet({ personalWallets: [ metamaskWallet(), coinbaseWallet(), walletConnect() ] })`,
    component: safeWallet({
      personalWallets: [metamaskWallet(), coinbaseWallet(), walletConnect()],
    }),
    import: "safeWallet",
  },
  "Smart Wallet": {
    code: `smartWallet({ factoryAddress: "YOUR_FACTORY_ADDRESS", gasless: true, personalWallets: [ metamaskWallet(), coinbaseWallet(), walletConnect() ] })`,
    component: smartWallet({
      factoryAddress: "FACTORY_ADDRESS",
      gasless: true,
    }),
    import: "smartWallet",
  },
  "Magic Link": {
    code: `magicLink({ apiKey: "YOUR_MAGIC_API_KEY", oauthOptions: { providers: ["google", "facebook", "twitter", "apple"] }})`,
    component: magicLink({
      apiKey: "pk_live_3EFC32B01A29985C",
      oauthOptions: {
        providers: ["google", "facebook", "twitter", "apple"],
      },
    }),
    import: "magicLink",
  },
  "Blocto Wallet": {
    code: "bloctoWallet()",
    component: bloctoWalletConfig,
    import: "bloctoWallet",
  },
  "Frame Wallet": {
    code: "frameWallet()",
    component: frameWalletConfig,
    import: "frameWallet",
  },
};

export const ConnectWalletWithPreview: React.FC = () => {
  const [btnTitle, setBtnTitle] = useState("");
  const [modalSize, setModalSize] = useState<"compact" | "wide">("wide");
  const [modalTitle, setModalTitle] = useState("");
  const { colorMode, toggleColorMode } = useColorMode();

  const selectedTheme = colorMode === "light" ? "light" : "dark";

  const [authEnabled, setAuthEnabled] = useState(false);
  const [switchToActiveChain, setSwitchToActiveChain] = useState(false);
  const [walletSelection, setWalletSelection] = useState<
    Record<WalletId, boolean>
  >({
    MetaMask: true,
    Coinbase: true,
    WalletConnect: true,
    Safe: false,
    "Smart Wallet": false,
    "Guest Mode": false,
    "Email Wallet": false,
    "Trust Wallet": true,
    "Zerion Wallet": true,
    "Blocto Wallet": false,
    "Magic Link": false,
    "Frame Wallet": false,
    "Rainbow Wallet": true,
    Phantom: true,
  });
  const [code, setCode] = useState("");

  const enabledWallets = Object.entries(walletSelection)
    .filter((x) => x[1])
    .map((x) => x[0] as WalletId);

  useEffect(() => {
    const _code = getWalletSetupCode({
      imports: enabledWallets.map((walletId) => wallets[walletId].import),
      thirdwebProvider: {
        supportedWallets:
          enabledWallets.length > 0
            ? `[${enabledWallets
                .map((walletId) => wallets[walletId].code)
                .join(",")}]`
            : undefined,
        authConfig: authEnabled
          ? `{ authUrl: "/api/auth", domain: "https://example.com" }`
          : undefined,
      },
      connectWallet: {
        theme: `"${selectedTheme}"`,
        btnTitle: btnTitle ? `"${btnTitle}"` : undefined,
        modalTitle: modalTitle ? `"${modalTitle}"` : undefined,
        auth: authEnabled ? "{ loginOptional: false }" : undefined,
        switchToActiveChain: switchToActiveChain ? "true" : undefined,
        modalSize: `"${modalSize}"`,
      },
    });

    format(_code, {
      parser: "babel",
      plugins: [parserBabel, estree],
      printWidth: 50,
    }).then((formattedCode) => {
      setCode(formattedCode);
    });
  }, [
    authEnabled,
    btnTitle,
    enabledWallets,
    modalTitle,
    selectedTheme,
    switchToActiveChain,
    modalSize,
  ]);

  const supportedWallets = enabledWallets.map(
    (walletId) => wallets[walletId].component,
  );

  const withThirdwebProvider = (content: React.ReactNode) => (
    <ThirdwebProvider
      activeChain="polygon"
      key={enabledWallets.join(",") + modalSize}
      supportedWallets={
        supportedWallets.length > 0 ? supportedWallets : undefined
      }
      authConfig={
        authEnabled
          ? {
              domain: THIRDWEB_DOMAIN,
              authUrl: `${THIRDWEB_API_HOST}/v1/auth`,
            }
          : undefined
      }
    >
      {content}
    </ThirdwebProvider>
  );

  const connectWalletButton = (
    <ConnectWallet
      modalSize={modalSize}
      modalTitle={modalTitle}
      theme={selectedTheme}
      btnTitle={btnTitle || undefined}
      // overrides
      auth={{ loginOptional: !authEnabled }}
      switchToActiveChain={switchToActiveChain}
    />
  );

  const componentPreview = withThirdwebProvider(
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
        walletIds={supportedWallets.map((x) => x.id)}
        modalTitle={modalTitle}
        selectedTheme={selectedTheme}
      />
    </ClientOnly>,
  );

  const connectWalletButtonPreview = withThirdwebProvider(connectWalletButton);

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Grid
      templateColumns={{
        md: "300px 1fr",
        sm: "1fr",
      }}
      gap={{
        base: 14,
        md: 4,
      }}
      mt={8}
    >
      {/* left */}
      <GridItem>
        <Tabs isLazy>
          <TabList fontSize={14}>
            <Tab> Wallets </Tab>
            <Tab> Appearance </Tab>
            <Tab> Features </Tab>
          </TabList>

          <TabPanels>
            {/* supportedWallets */}
            <TabPanel p={0} pt={6}>
              <Grid
                flexWrap={"wrap"}
                gap={3}
                templateColumns={{
                  base: "1fr",
                }}
              >
                {Object.keys(wallets).map((key) => {
                  const walletId = key as WalletId;
                  const walletInfo = wallets[walletId];
                  const isChecked = walletSelection[walletId];

                  return (
                    <Flex
                      key={walletId}
                      borderRadius="xl"
                      bg={isChecked ? "hsl(215.88deg 100% 60% / 15%)" : "none"}
                      cursor="pointer"
                      _hover={
                        !isChecked
                          ? {
                              bg: "inputBg",
                              borderColor: "heading",
                            }
                          : {}
                      }
                      transition="background 200ms ease"
                      p={2}
                      alignItems="center"
                      onClick={() => {
                        setWalletSelection({
                          ...walletSelection,
                          [walletId]: !walletSelection[walletId],
                        });
                      }}
                      userSelect={"none"}
                      gap={3}
                    >
                      <Image
                        width={10}
                        height={10}
                        alt={walletInfo.component.meta.name}
                        src={replaceIpfsUrl(walletInfo.component.meta.iconURL)}
                      />

                      <Flex
                        gap={3}
                        alignItems="center"
                        justifyContent="space-between"
                        flex={1}
                      >
                        <Text
                          fontWeight={600}
                          fontSize={16}
                          color={isChecked ? "heading" : "paragraph"}
                        >
                          {walletId}
                        </Text>
                      </Flex>
                    </Flex>
                  );
                })}
              </Grid>
            </TabPanel>

            {/* Appearance */}
            <TabPanel p={0} pt={6}>
              <Flex direction="column" gap={5}>
                {/* theme */}
                <FormItem
                  label="Theme"
                  description="Theme to use for ConnectWallet button and modal"
                >
                  <Flex gap={2}>
                    <Button
                      w={10}
                      h={10}
                      borderRadius="50%"
                      aria-label="dark"
                      border="3px solid"
                      bg="black"
                      _hover={{
                        bg: "black",
                      }}
                      borderColor={
                        selectedTheme === "dark" ? "blue.500" : "gray.800"
                      }
                      onClick={() => {
                        if (selectedTheme === "dark") {
                          return;
                        }
                        toggleColorMode();
                      }}
                    ></Button>

                    <Button
                      w={10}
                      h={10}
                      bg="white"
                      _hover={{
                        bg: "white",
                      }}
                      borderRadius="50%"
                      aria-label="light"
                      border="3px solid"
                      borderColor={
                        selectedTheme === "light" ? "blue.500" : "gray.200"
                      }
                      onClick={() => {
                        if (selectedTheme === "light") {
                          return;
                        }
                        toggleColorMode();
                      }}
                    ></Button>
                  </Flex>
                </FormItem>

                {/* modal size */}
                {!isMobile && (
                  <FormItem
                    label="Modal Size"
                    description="Specify the size of ConnectWallet modal. Modal is always compact on mobile device."
                  >
                    <Select
                      variant="filled"
                      value={modalSize}
                      onChange={(event) => {
                        setModalSize(event.target.value as "wide" | "compact");
                      }}
                    >
                      <option value="wide">wide</option>
                      <option value="compact">compact</option>
                    </Select>
                  </FormItem>
                )}

                {/* Button Title */}
                <FormItem
                  label="Button Title"
                  description="Title of ConnectWallet button"
                >
                  <Input
                    placeholder="Connect Wallet"
                    value={btnTitle}
                    onChange={(e) => {
                      setBtnTitle(e.target.value);
                    }}
                  />
                </FormItem>

                {/* Modal Title */}
                <FormItem
                  label="Modal Title"
                  description="Title of ConnectWallet Modal"
                >
                  <Input
                    placeholder="Choose your wallet"
                    value={modalTitle}
                    onChange={(e) => {
                      setModalTitle(e.target.value);
                    }}
                  />
                </FormItem>
              </Flex>
            </TabPanel>

            {/* Features */}
            <TabPanel p={0} pt={6}>
              <Flex direction="column" gap={5}>
                {/* auth */}
                <FormItem
                  label="Auth"
                  description="Enforce that users must sign in with their wallet using auth after connecting their wallet."
                >
                  <Switch
                    size="lg"
                    isChecked={authEnabled}
                    onChange={() => {
                      setAuthEnabled(!authEnabled);
                    }}
                  />
                </FormItem>

                {/* switch to active chain */}
                <FormItem
                  label="Switch to activeChain"
                  description={`Specify whether to show a "Switch Network" button after the wallet is connected but it is not connected to the activeChain set in ThirdwebProvider`}
                >
                  <Switch
                    size="lg"
                    isChecked={switchToActiveChain}
                    onChange={() => {
                      setSwitchToActiveChain(!switchToActiveChain);
                    }}
                  />
                </FormItem>
              </Flex>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </GridItem>

      {/* right */}
      <GridItem>
        <Tabs>
          <TabList fontSize={14}>
            <Tab> Preview </Tab>
            <Tab> Code </Tab>
          </TabList>

          <TabPanels>
            <TabPanel p={0} pt={6}>
              <Box
                borderRadius="md"
                w="full"
                my="auto"
                display="flex"
                flexDir="column"
                justifyContent="center"
                alignItems="center"
                minH="800px"
                py={8}
              >
                <Box>
                  <Text color={"gray.700"} textAlign="center">
                    Live Preview
                  </Text>
                  <Box height={2} />
                  <Box>{connectWalletButtonPreview}</Box>
                </Box>

                <Box height={12} />

                <Box>
                  <Text color={"gray.700"} textAlign="center">
                    Modal UI
                  </Text>
                  <Box height={2} />
                  {componentPreview}
                </Box>
              </Box>
            </TabPanel>

            <TabPanel p={0} pt={6}>
              <CodeBlock language="jsx" code={code} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </GridItem>
    </Grid>
  );
};

const ConnectModalInlinePreview = (props: {
  walletIds: string[];
  modalTitle: string;
  modalSize: "compact" | "wide";
  selectedTheme: Theme;
}) => {
  const isMobile = useBreakpointValue(
    { base: true, md: false },
    { ssr: false },
  );
  const disconnect = useDisconnect();
  const walletIdsJoin = props.walletIds.join(",");
  const connectionStatus = useConnectionStatus();

  // if somehow the wallet is connected, disconnect it
  useEffect(() => {
    if (connectionStatus === "connected") {
      disconnect();
    }
  }, [walletIdsJoin, disconnect, connectionStatus]);

  let showInlineModal = true;

  if (props.walletIds.length === 1) {
    const walletId = props.walletIds[0];

    if (hideUIForWalletIds.has(walletId)) {
      showInlineModal = false;
    }
    if (isMobile && hideUIForWalletIdsMobile.has(walletId)) {
      showInlineModal = false;
    }
  }

  return (
    <Flex
      width="full"
      justifyContent="flex-start"
      alignItems="center"
      flexDir="column"
      gap={12}
      cursor="not-allowed"
    >
      {showInlineModal && (
        <ConnectModalInline
          modalSize={isMobile ? "compact" : props.modalSize}
          className={styles.ConnectModalInline}
          title={props.modalTitle}
          theme={props.selectedTheme}
        />
      )}

      {!showInlineModal && (
        <Box
          textAlign="center"
          bg="backgroundBody"
          p={3}
          border="1px solid"
          borderColor="backgroundHighlight"
          borderRadius="md"
          maxW="400px"
        >
          <Text mb={2}>
            {" "}
            Can not show Modal UI for selected configuration because it triggers
            wallet connection{" "}
          </Text>
          <Text> See Live Preview instead </Text>
        </Box>
      )}
    </Flex>
  );
};

const FormItem: React.FC<{
  label: string;
  children: React.ReactNode;
  description: React.ReactNode;
}> = (props) => {
  return (
    <FormControl>
      <Flex gap={2} mb={2} alignItems="center">
        <FormLabel m={0}>{props.label}</FormLabel>
        <Tooltip
          hasArrow
          shouldWrapChildren
          border="1px solid"
          borderColor="backgroundCardHighlight"
          placement="top-start"
          borderRadius="md"
          px={3}
          py={2}
          label={<Box>{props.description}</Box>}
        >
          <div>
            <AiOutlineInfoCircle color="gray.700" />
          </div>
        </Tooltip>
      </Flex>

      {props.children}
    </FormControl>
  );
};

function getWalletSetupCode(options: WalletSetupOptions) {
  return `\
import {
  ThirdwebProvider,
  ConnectWallet
  ${options.imports.length > 0 ? `, ${options.imports.join(",")}` : ""}
} from "@thirdweb-dev/react";

export default function App() {
  return (
    <ThirdwebProvider activeChain="polygon" clientId="YOUR_CLIENT_ID" ${renderProps(
      options.thirdwebProvider,
    )} >
      <ConnectWallet ${renderProps(options.connectWallet)}   />
    </ThirdwebProvider>
  );
}`;
}

function renderProps(obj: Record<string, string | undefined>) {
  return Object.entries(obj)
    .filter((x) => x[1] !== undefined)
    .map(([key, value]) => {
      return `${key}={${value}}`;
    })
    .join(" ");
}
