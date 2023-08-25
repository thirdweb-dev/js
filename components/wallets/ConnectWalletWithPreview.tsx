import {
  Box,
  Flex,
  FormControl,
  GridItem,
  Input,
  Select,
  SimpleGrid,
  Image,
  Tooltip,
  useBreakpointValue,
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
  bloctoWallet,
  frameWallet,
  rainbowWallet,
} from "@thirdweb-dev/react";
import React, { useEffect, useState } from "react";
import { CodeBlock, FormLabel, Heading } from "tw-components";
import { replaceIpfsUrl } from "lib/sdk";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { THIRDWEB_DOMAIN, THIRDWEB_API_HOST } from "constants/urls";
import { format } from "prettier/standalone";
import parserBabel from "prettier/plugins/babel";
import estree from "prettier/plugins/estree";

type Theme = "light" | "dark" | "default";
type EnabledOrDisabled = "enabled" | "disabled";
type DefaultOrCustom = "default" | "custom";
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
  | "Rainbow Wallet";
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
    dropdownPosition?: string;
  };
};

const wallets: WalletInfo = {
  MetaMask: {
    code: "metamaskWallet()",
    component: metamaskWallet(),
    import: "metamaskWallet",
  },
  Coinbase: {
    code: "coinbaseWallet()",
    component: coinbaseWallet(),
    import: "coinbaseWallet",
  },
  WalletConnect: {
    code: "walletConnect()",
    component: walletConnect(),
    import: "walletConnect",
  },
  "Email Wallet": {
    code: `paperWallet({ paperClientId: "YOUR_PAPER_CLIENT_ID" })`,
    component: paperWallet({
      paperClientId: "9a2f6238-c441-4bf4-895f-d13c2faf2ddb",
    }),
    import: "paperWallet",
  },
  "Guest Mode": {
    code: `localWallet()`,
    component: localWallet(),
    import: "localWallet",
  },
  "Smart Wallet": {
    code: `smartWallet({ factoryAddress: "YOUR_FACTORY_ADDRESS", gasless: true, personalWallets: [ metamaskWallet(), coinbaseWallet(), walletConnect() ] })`,
    component: smartWallet({
      factoryAddress: "FACTORY_ADDRESS",
      gasless: true,
    }),
    import: "smartWallet",
  },
  Safe: {
    code: `safeWallet({ personalWallets: [ metamaskWallet(), coinbaseWallet(), walletConnect() ] })`,
    component: safeWallet({
      personalWallets: [metamaskWallet(), coinbaseWallet(), walletConnect()],
    }),
    import: "safeWallet",
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
  "Rainbow Wallet": {
    code: `rainbowWallet()`,
    component: rainbowWallet(),
    import: "rainbowWallet",
  },
  "Trust Wallet": {
    code: `trustWallet()`,
    component: trustWallet(),
    import: "trustWallet",
  },
  "Zerion Wallet": {
    code: "zerionWallet()",
    component: zerionWallet(),
    import: "zerionWallet",
  },
  "Blocto Wallet": {
    code: "bloctoWallet()",
    component: bloctoWallet(),
    import: "bloctoWallet",
  },
  "Frame Wallet": {
    code: "frameWallet()",
    component: frameWallet(),
    import: "frameWallet",
  },
};

export const ConnectWalletWithPreview: React.FC = () => {
  const [btnTitle, setBtnTitle] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [dropdownPosition, setdropdownPosition] =
    useState<DefaultOrCustom>("default");
  const [selectedTheme, setSelectedTheme] = useState<Theme>("default");
  const [authEnabled, setAuthEnabled] = useState<EnabledOrDisabled>("disabled");
  const [walletSelection, setWalletSelection] = useState<
    Record<WalletId, boolean>
  >({
    MetaMask: true,
    Coinbase: true,
    WalletConnect: true,
    Safe: false,
    "Smart Wallet": false,
    "Guest Mode": true,
    "Email Wallet": true,
    "Trust Wallet": false,
    "Zerion Wallet": false,
    "Blocto Wallet": false,
    "Magic Link": false,
    "Frame Wallet": false,
    "Rainbow Wallet": false,
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
        authConfig:
          authEnabled === "enabled"
            ? `{ authUrl: "/api/auth", domain: "https://example.com" }`
            : undefined,
      },
      connectWallet: {
        theme: selectedTheme === "default" ? undefined : `"${selectedTheme}"`,
        btnTitle: btnTitle ? `"${btnTitle}"` : undefined,
        modalTitle: modalTitle ? `"${modalTitle}"` : undefined,
        auth:
          authEnabled === "enabled" ? "{ loginOptional: false }" : undefined,
        dropdownPosition:
          dropdownPosition === "custom"
            ? `{ align: "center", side: "bottom" }`
            : undefined,
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
    dropdownPosition,
    enabledWallets,
    modalTitle,
    selectedTheme,
  ]);

  const supportedWallets = enabledWallets.map(
    (walletId) => wallets[walletId].component,
  );

  const isMobile = useBreakpointValue({ base: true, md: false });

  const previewCode = (
    <ThirdwebProvider
      key={enabledWallets.join(",")}
      supportedWallets={
        supportedWallets.length > 0 ? supportedWallets : undefined
      }
      authConfig={
        authEnabled === "enabled"
          ? {
              domain: THIRDWEB_DOMAIN,
              authUrl: `${THIRDWEB_API_HOST}/v1/auth`,
            }
          : undefined
      }
    >
      <ConnectWallet
        modalTitle={modalTitle}
        dropdownPosition={
          dropdownPosition === "custom"
            ? {
                align: "center",
                side: "bottom",
              }
            : undefined
        }
        theme={selectedTheme === "default" ? undefined : selectedTheme}
        btnTitle={btnTitle || undefined}
        // overrides
        auth={{ loginOptional: authEnabled === "disabled" }}
      />
    </ThirdwebProvider>
  );

  return (
    <SimpleGrid columns={{ base: 6, md: 12 }} gap={8} mt={8}>
      {/* left */}
      <GridItem colSpan={6}>
        <Flex direction="column" gap={5}>
          <Box mb={4}>
            {/* supportedWallets */}
            <FormItem
              label="Wallets"
              description="Wallets to show in ConnectWallet modal"
            >
              <SimpleGrid columns={{ base: 6, md: 2 }} gap={2}>
                {Object.keys(wallets).map((key) => {
                  const walletId = key as WalletId;
                  const walletInfo = wallets[walletId];
                  const isChecked = walletSelection[walletId];

                  return (
                    <Flex
                      key={walletId}
                      borderRadius="lg"
                      gap={3}
                      bg={isChecked ? "heading" : "none"}
                      color={isChecked ? "backgroundBody" : "none"}
                      cursor="pointer"
                      _hover={
                        !isChecked
                          ? {
                              bg: "inputBg",
                              borderColor: "heading",
                            }
                          : undefined
                      }
                      border={"2px solid"}
                      borderColor={
                        isChecked ? "backgroundBody" : "inputBgHover"
                      }
                      px={3}
                      py={2}
                      alignItems="center"
                      onClick={() => {
                        setWalletSelection({
                          ...walletSelection,
                          [walletId]: !walletSelection[walletId],
                        });
                      }}
                      userSelect={"none"}
                    >
                      <Image
                        width={7}
                        height={7}
                        alt={walletInfo.component.meta.name}
                        src={replaceIpfsUrl(walletInfo.component.meta.iconURL)}
                      />{" "}
                      {!isMobile && walletId}
                    </Flex>
                  );
                })}
              </SimpleGrid>
            </FormItem>
          </Box>

          {/* theme */}
          <FormItem
            label="Theme"
            description="Theme to use for ConnectWallet button and modal"
          >
            <Select
              variant="filled"
              value={selectedTheme}
              onChange={(event) => {
                setSelectedTheme(event.target.value as Theme);
              }}
            >
              <option value="default">Default (Dark)</option>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </Select>
          </FormItem>

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

          {/* auth */}
          <FormItem
            label="Auth"
            description="Enforce that users must sign in with their wallet using auth after connecting their wallet."
          >
            <Select
              variant="filled"
              value={authEnabled}
              onChange={(event) => {
                setAuthEnabled(event.target.value as EnabledOrDisabled);
              }}
            >
              <option value="disabled">Disabled</option>
              <option value="enabled">Enabled</option>
            </Select>
          </FormItem>

          {/* dropdownPosition */}
          <FormItem
            label="Dropdown Position"
            description="Specify where should the details dropdown menu open relative to the ConnectWallet Button."
          >
            <Select
              variant="filled"
              value={dropdownPosition}
              onChange={(event) => {
                setdropdownPosition(event.target.value as DefaultOrCustom);
              }}
            >
              <option value="default">Default</option>
              <option value="custom">Custom</option>
            </Select>
          </FormItem>
        </Flex>
      </GridItem>

      {/* right */}
      <GridItem colSpan={6} gap={4}>
        {/* preview */}
        <Flex gap={6} direction="column" align="flex-start">
          <Flex direction="column" gap={2} w={"full"}>
            <Heading size="label.md">Preview</Heading>
            <Box
              borderRadius="md"
              w="full"
              my="auto"
              display="grid"
              placeItems="center"
              h="100px"
              bg={selectedTheme === "light" ? "gray.300" : "black"}
              border="1px solid"
              borderColor={"backgroundHighlight"}
            >
              {previewCode}
            </Box>
          </Flex>

          <Flex direction="column" gap={2} w={"full"}>
            <Heading size="label.md">Code</Heading>
            <CodeBlock language="jsx" code={code} />
          </Flex>
        </Flex>
      </GridItem>
    </SimpleGrid>
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
    <ThirdwebProvider clientId="YOUR_CLIENT_ID" ${renderProps(
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
