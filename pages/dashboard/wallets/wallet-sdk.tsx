import { Box, Flex, SimpleGrid } from "@chakra-ui/react";
import { useSigner } from "@thirdweb-dev/react";
import { AppLayout } from "components/app-layouts/app";
import { CodeSegment } from "components/contract-tabs/code/CodeSegment";
import { CodeEnvironment } from "components/contract-tabs/code/types";
import { ChainIcon } from "components/icons/ChainIcon";
import { formatSnippet } from "contract-ui/tabs/code/components/code-overview";
import { WalletsSidebar } from "core-ui/sidebar/wallets";
import { useChainSlug } from "hooks/chains/chainSlug";
import { PageId } from "page-id";
import React, { useMemo, useState } from "react";
import { Card, Heading, Link, Text } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

export const WALLETS_SNIPPETS = [
  {
    id: "smart-wallet",
    name: "Smart Wallet",
    description: "Deploy smart contract wallets for your users",
    iconUrl:
      "ipfs://QmeAJVqn17aDNQhjEU3kcWVZCFBrfta8LzaDGkS8Egdiyk/smart-wallet.svg",
    link: "https://portal.thirdweb.com/wallet/smart-wallet",
    supportedLanguages: {
      javascript: `import {{chainName}} from "@thirdweb-dev/chains";
import { LocalWallet, SmartWallet } from "@thirdweb-dev/wallets";

// First, connect the personal wallet, which can be any wallet (metamask, walletconnect, etc.)
// Here we're just generating a new local wallet which can be saved later
const personalWallet = new LocalWallet();
await personalWallet.generate();

// Setup the Smart Wallet configuration
const config = {
  chain: {{chainName}}, // the chain where your smart wallet will be or is deployed
  factoryAddress: "{{factory_address}}", // your own deployed account factory address
  clientId: "YOUR_CLIENT_ID", // or use secretKey for backend/node scripts
  gasless: true, // enable or disable gasless transactions
};

// Then, connect the Smart wallet
const wallet = new SmartWallet(config);
await wallet.connect({
  personalWallet,
});`,
      react: `import {{chainName}} from "@thirdweb-dev/chains";
import { ThirdwebProvider, ConnectWallet, smartWallet } from "@thirdweb-dev/react";

export default function App() {
return (
    <ThirdwebProvider
      clientId="YOUR_CLIENT_ID"
      activeChain={{chainName}}
      supportedWallets={[
        smartWallet({
          factoryAddress: "{{factory_address}}",
          gasless: true,
          personalWallets={[...]}
        })
      ]}
    >
      <ConnectWallet />
    </ThirdwebProvider>
  );
}`,
      "react-native": `import {{chainName}} from "@thirdweb-dev/chains";
import { ThirdwebProvider, ConnectWallet, smartWallet } from "@thirdweb-dev/react-native";

export default function App() {
return (
    <ThirdwebProvider
      clientId="YOUR_CLIENT_ID"
      activeChain={{chainName}}
      supportedWallets={[
        smartWallet({
          factoryAddress: "{{factory_address}}",
          gasless: true,
          personalWallets={[...]}
        })
      ]}
    >
      <ConnectWallet />
    </ThirdwebProvider>
  );
}`,
      unity: `using Thirdweb;

public async void ConnectWallet()
{
    // Reference to your Thirdweb SDK
    var sdk = ThirdwebManager.Instance.SDK;

    // Configure the connection
    var connection = new WalletConnection(
      provider: WalletProvider.SmartWallet,        // The wallet provider you want to connect to (Required)
      chainId: 1,                                  // The chain you want to connect to (Required)
      password: "myEpicPassword",                  // If using a local wallet as personal wallet (Optional)
      email: "email@email.com",                    // If using an email wallet as personal wallet (Optional)
      personalWallet: WalletProvider.LocalWallet   // The personal wallet you want to use with your Smart Wallet (Optional)
    );

    // Connect the wallet
    string address = await sdk.wallet.Connect(connection);
}`,
    },
  },
  {
    id: "local-wallet",
    name: "Local Wallet",
    description: "Generate wallets for new users on the fly",
    iconUrl:
      "ipfs://QmeAJVqn17aDNQhjEU3kcWVZCFBrfta8LzaDGkS8Egdiyk/local-wallet-desktop.svg",
    link: "https://portal.thirdweb.com/wallet/local-wallet",
    supportedLanguages: {
      javascript: `import { LocalWallet } from "@thirdweb-dev/wallets";

const wallet = new LocalWallet();

// generate a random wallet
await wallet.generate();
// connect the wallet to the application
await wallet.connect();

// at any point, you can save the wallet to persistent storage
await wallet.save(config);
// and load it back up
await wallet.load(config);

// you can also export the wallet out of the application
const exportedWallet = await wallet.export(config);
// and import it back in
await wallet.import(exportedWallet, config);`,
      react: `import { ThirdwebProvider, ConnectWallet, localWallet } from "@thirdweb-dev/react";

export default function App() {
return (
    <ThirdwebProvider
      clientId="YOUR_CLIENT_ID"
      supportedWallets={[ localWallet() ]}
    >
      <ConnectWallet />
    </ThirdwebProvider>
  );
}`,
      "react-native": `import { ThirdwebProvider, ConnectWallet, localWallet } from "@thirdweb-dev/react-native";

export default function App() {
return (
    <ThirdwebProvider
      clientId="YOUR_CLIENT_ID"
      supportedWallets={[ localWallet() ]}
    >
      <ConnectWallet />
    </ThirdwebProvider>
  );
}`,
      unity: `using Thirdweb;

public async void ConnectWallet()
{
    // Reference to your Thirdweb SDK
    var sdk = ThirdwebManager.Instance.SDK;

    // Configure the connection
    var connection = new WalletConnection(
      provider: WalletProvider.LocalWallet,      // The wallet provider you want to connect to (Required)
      chainId: 1,                                // The chain you want to connect to (Required)
      password: "myEpicPassword"                 // Used to encrypt your Local Wallet, defaults to device uid (Optional)
    );

    // Connect the wallet
    string address = await sdk.wallet.Connect(connection);
}`,
    },
  },
  {
    id: "coinbase-wallet",
    name: "Coinbase Wallet",
    description: "Connect with Coinbase Wallet",
    iconUrl:
      "ipfs://QmcJBHopbwfJcLqJpX2xEufSS84aLbF7bHavYhaXUcrLaH/coinbase.svg",
    link: "https://portal.thirdweb.com/wallet/coinbase-wallet",
    supportedLanguages: {
      javascript: `import { CoinbaseWallet } from "@thirdweb-dev/wallets";

const wallet = new CoinbaseWallet();

wallet.connect();`,
      react: `import { ThirdwebProvider, ConnectWallet, coinbaseWallet } from "@thirdweb-dev/react";

export default function App() {
return (
    <ThirdwebProvider
      clientId="YOUR_CLIENT_ID"
      supportedWallets={[ coinbaseWallet() ]}
    >
      <ConnectWallet />
    </ThirdwebProvider>
  );
}`,
      "react-native": `import { ThirdwebProvider, ConnectWallet, coinbaseWallet } from "@thirdweb-dev/react-native";

export default function App() {
return (
    <ThirdwebProvider
      clientId="YOUR_CLIENT_ID"
      supportedWallets={[ coinbaseWallet() ]}
    >
      <ConnectWallet />
    </ThirdwebProvider>
  );
}`,
      unity: `using Thirdweb;

public async void ConnectWallet()
{
    // Reference to your Thirdweb SDK
    var sdk = ThirdwebManager.Instance.SDK;

    // Configure the connection
    var connection = new WalletConnection(
      provider: WalletProvider.Coinbase,        // The wallet provider you want to connect to (Required)
      chainId: 1                                // The chain you want to connect to (Required)
    );

    // Connect the wallet
    string address = await sdk.wallet.Connect(connection);
}`,
    },
  },
  {
    id: "metamask",
    name: "MetaMask",
    description: "Connect with MetaMask",
    iconUrl:
      "ipfs://QmZZHcw7zcXursywnLDAyY6Hfxzqop5GKgwoq8NB9jjrkN/metamask.svg",
    link: "https://portal.thirdweb.com/wallet/metamask",
    supportedLanguages: {
      javascript: `import { MetaMaskWallet } from "@thirdweb-dev/wallets";

const wallet = new MetaMaskWallet();

wallet.connect();`,
      react: `import { ThirdwebProvider, ConnectWallet, metamaskWallet } from "@thirdweb-dev/react";

export default function App() {
return (
    <ThirdwebProvider
      clientId="YOUR_CLIENT_ID"
      supportedWallets={[ metamaskWallet() ]}
    >
      <ConnectWallet />
    </ThirdwebProvider>
  );
}`,
      "react-native": `import { ThirdwebProvider, ConnectWallet, metamaskWallet } from "@thirdweb-dev/react-native";

export default function App() {
return (
    <ThirdwebProvider
      clientId="YOUR_CLIENT_ID"
      supportedWallets={[ metamaskWallet() ]}
    >
      <ConnectWallet />
    </ThirdwebProvider>
  );
}`,
      unity: `using Thirdweb;

public async void ConnectWallet()
{
    // Reference to your Thirdweb SDK
    var sdk = ThirdwebManager.Instance.SDK;

    // Configure the connection
    var connection = new WalletConnection(
      provider: WalletProvider.Metamask,       // The wallet provider you want to connect to (Required)
      chainId: 1                               // The chain you want to connect to (Required)
    );

    // Connect the wallet
    string address = await sdk.wallet.Connect(connection);
}`,
    },
  },
  {
    id: "embedded-wallet",
    name: "Embedded Wallet",
    description: "Connect with email and social logins",
    iconUrl:
      "ipfs://QmNrLXtPoFrh4yjZbXui39zUMozS1oetpgU8dvZhFAxfRa/paper-logo-icon.svg",
    link: "https://portal.thirdweb.com/wallet/embedded-wallet",
    supportedLanguages: {
      javascript: `import { EmbeddedWallet } from "@thirdweb-dev/wallets";
import { Ethereum } from "@thirdweb-dev/chains";

const wallet = new EmbeddedWallet({
  chain: Ethereum, //  chain to connect to
  clientId: "YOUR_CLIENT_ID", // Your thirdweb client ID
});

wallet.connect();`,
      react: `import { ThirdwebProvider, ConnectWallet, embeddedWallet } from "@thirdweb-dev/react";

export default function App() {
return (
    <ThirdwebProvider
      clientId="YOUR_CLIENT_ID"
      supportedWallets={[ embeddedWallet() ]}
    >
      <ConnectWallet />
    </ThirdwebProvider>
  );
}`,
      "react-native": `import { ThirdwebProvider, ConnectWallet, embeddedWallet } from "@thirdweb-dev/react-native";

export default function App() {
return (
    <ThirdwebProvider
      clientId="YOUR_CLIENT_ID"
      supportedWallets={[ embeddedWallet() ]}
    >
      <ConnectWallet />
    </ThirdwebProvider>
  );
}`,

      unity: `using Thirdweb;

public async void ConnectWallet()
{
    // Reference to your Thirdweb SDK
    var sdk = ThirdwebManager.Instance.SDK;

    // Configure the connection
    var connection = new WalletConnection(
      provider: WalletProvider.EmbeddedWallet,
      chainId: 1,
      email: "email@email.com"
    );

    // Connect the wallet
    string address = await sdk.wallet.Connect(connection);
}`,
    },
  },
  /*   {
    id: "ethers",
    name: "Ethers.js",
    description: "Connect any ethers.js compatible wallet",
    iconUrl: "ipfs://QmTWXcv6XnRqwUwEQxWp21oCrXZJ5QomiSTVBjKPQAv92k/ethers.png",
    link: "https://portal.thirdweb.com/wallet",
    supportedLanguages: {
      javascript: ``,
    },
  },
  {
    id: "private-key",
    name: "Private Key",
    description: "Connect a wallet directly by private key",
    iconUrl:
      "ipfs://QmNrycnX15y8EwxDPrwSxnwQgTBWRxUgwSirmhAFoGSod7/private-key.png",
    link: "https://portal.thirdweb.com/wallet",
    supportedLanguages: {
      javascript: ``,
    },
  }, */
  {
    id: "aws-kms",
    name: "AWS KMS",
    description: "Connect with AWS Key Management Service",
    iconUrl:
      "ipfs://QmVuWYpq5CaMfmbB1qMXXgc4dtUUGY31xiG6sxwvNafoZg/aws-kms.png",
    link: "https://portal.thirdweb.com/wallet/aws-kms",
    supportedLanguages: {
      javascript: `import { AwsKmsWallet } from "@thirdweb-dev/wallets/evm/wallets/aws-kms";

const wallet = new AwsKmsWallet({
  region: "us-east-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN,
  keyId: process.env.AWS_KEY_ID,
});`,
    },
  },
  {
    id: "aws-secrets-manager",
    name: "AWS Secrets Manager",
    description: "Connect with AWS Secrets Manager",
    iconUrl:
      "ipfs://QmVuWYpq5CaMfmbB1qMXXgc4dtUUGY31xiG6sxwvNafoZg/aws-secrets-manager.png",
    link: "https://portal.thirdweb.com/wallet/aws-secrets-manager",
    supportedLanguages: {
      javascript: `import { AwsSecretsManagerWallet } from "@thirdweb-dev/wallets/evm/wallets/aws-secrets-manager";

const wallet = new AwsSecretsManagerWallet({
  secretId: "{{secret-id}}", // ID of the secret value
  secretKeyName: "{{secret-key-name}}", // Name of the secret value
  awsConfig: {
    region: "us-east-1", // Region where your secret is stored
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Add environment variables to store your AWS credentials
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Add environment variables to store your AWS credentials
    },
  },
});`,
    },
  },
  {
    id: "rainbow",
    name: "Rainbow",
    description: "Connect with Rainbow Wallet",
    iconUrl:
      "ipfs://QmSZn47p4DVVBfzvg9BAX2EqwnPxkT1YAE7rUnrtd9CybQ/rainbow-logo.png",
    link: "https://portal.thirdweb.com/wallet/rainbow",
    supportedLanguages: {
      javascript: `import { RainbowWallet } from "@thirdweb-dev/wallets";

const wallet = new RainbowWallet();

wallet.connect();`,
      react: `import { ThirdwebProvider, ConnectWallet, rainbowWallet } from "@thirdweb-dev/react";

export default function App() {
return (
    <ThirdwebProvider
      clientId="YOUR_CLIENT_ID"
      supportedWallets={[ rainbowWallet() ]}
    >
      <ConnectWallet />
    </ThirdwebProvider>
  );
}`,
      "react-native": `import { ThirdwebProvider, ConnectWallet, rainbowWallet } from "@thirdweb-dev/react-native";

export default function App() {
return (
    <ThirdwebProvider
      clientId="YOUR_CLIENT_ID"
      supportedWallets={[ rainbowWallet() ]}
    >
      <ConnectWallet />
    </ThirdwebProvider>
  );
}`,
    },
  },
  {
    id: "trust",
    name: "Trust Wallet",
    description: "Connect with Trust Wallet",
    iconUrl:
      "ipfs://QmNigQbXk7wKZwDcgN38Znj1ZZQ3JEG3DD6fUKLBU8SUTP/trust%20wallet.svg",
    link: "https://portal.thirdweb.com/wallet/trust-wallet",
    supportedLanguages: {
      javascript: `import { TrustWallet } from "@thirdweb-dev/wallets";

const wallet = new TrustWallet();

wallet.connect();`,
      react: `import { ThirdwebProvider, ConnectWallet, trustWallet } from "@thirdweb-dev/react";

export default function App() {
return (
    <ThirdwebProvider
      clientId="YOUR_CLIENT_ID"
      supportedWallets={[ trustWallet() ]}
    >
      <ConnectWallet />
    </ThirdwebProvider>
  );
}`,
      "react-native": `import { ThirdwebProvider, ConnectWallet, trustWallet } from "@thirdweb-dev/react-native";

export default function App() {
return (
    <ThirdwebProvider
      clientId="YOUR_CLIENT_ID"
      supportedWallets={[ trustWallet() ]}
    >
      <ConnectWallet />
    </ThirdwebProvider>
  );
}`,
    },
  },
  {
    id: "wallet-connect",
    name: "WalletConnect",
    description: "Connect with WalletConnect",
    iconUrl:
      "ipfs://QmX58KPRaTC9JYZ7KriuBzeoEaV2P9eZcA3qbFnTHZazKw/wallet-connect.svg",
    link: "https://portal.thirdweb.com/wallet/wallet-connect-v2",
    supportedLanguages: {
      javascript: `import { WalletConnect } from "@thirdweb-dev/wallets";

const wallet = new WalletConnect();

wallet.connect();`,
      react: `import { ThirdwebProvider, ConnectWallet, walletConnect } from "@thirdweb-dev/react";

export default function App() {
return (
    <ThirdwebProvider
      clientId="YOUR_CLIENT_ID"
      supportedWallets={[ walletConnect() ]}
    >
      <ConnectWallet />
    </ThirdwebProvider>
  );
}`,
      "react-native": `import { ThirdwebProvider, ConnectWallet, walletConnect } from "@thirdweb-dev/react-native";
export default function App() {
  return (
      <ThirdwebProvider
        clientId="YOUR_CLIENT_ID"
        supportedWallets={[ walletConnect() ]}
      >
        <ConnectWallet />
      </ThirdwebProvider>
    );
}`,
      unity: `using Thirdweb;

public async void ConnectWallet()
{
    // Reference to your Thirdweb SDK
    var sdk = ThirdwebManager.Instance.SDK;

    // Configure the connection
    var connection = new WalletConnection(
      provider: WalletProvider.WalletConnect,     // The wallet provider you want to connect to (Required)
      chainId: 1                                  // The chain you want to connect to (Required)
    );

    // Connect the wallet
    string address = await sdk.wallet.Connect(connection);
}`,
    },
  },
  {
    id: "safe-wallet",
    name: "Safe",
    description: "Connect to multi-sig wallets via Safe",
    iconUrl:
      "ipfs://QmbbyxDDmmLQh8DzzeUR6X6B75bESsNUFmbdvS3ZsQ2pN1/SafeToken.svg",
    link: "https://portal.thirdweb.com/wallet/safe",
    supportedLanguages: {
      javascript: `import { CoinbaseWallet, SafeWallet } from "@thirdweb-dev/wallets";
import { Ethereum } from "@thirdweb-dev/chains";

// First, connect the personal wallet
const personalWallet = new CoinbaseWallet();
await personalWallet.connect();

// Then, connect the Safe wallet
const wallet = new SafeWallet();
await wallet.connect({
  personalWallet: personalWallet,
  chain: Ethereum,
  safeAddress: "{{contract_address}}",
});`,
      react: `import { ThirdwebProvider, ConnectWallet, safeWallet } from "@thirdweb-dev/react";

export default function App() {
return (
    <ThirdwebProvider
      clientId="YOUR_CLIENT_ID"
      supportedWallets={[ safeWallet() ]}
    >
      <ConnectWallet />
    </ThirdwebProvider>
  );
}`,
    },
  },
  {
    id: "magic-link",
    name: "Magic Link",
    description: "Connect with email or phone number via Magic",
    iconUrl:
      "ipfs://QmUMBFZGXxBpgDmZzZAHhbcCL5nYvZnVaYLTajsNjLcxMU/1-Icon_Magic_Color.svg",
    link: "https://portal.thirdweb.com/wallet/magic",
    supportedLanguages: {
      javascript: `import { MagicLink } from "@thirdweb-dev/wallets";

// create a wallet instance
const wallet = new MagicLink({
  apiKey: "YOUR_API_KEY",
});

// now connect using email or phone number

wallet.connect({
  email: "user@example.com",
});

// OR

wallet.connect({
  phoneNumber: "+123456789",
});`,
      react: `import { ThirdwebProvider, ConnectWallet, magicLink } from "@thirdweb-dev/react";

export default function App() {
return (
    <ThirdwebProvider
      clientId="YOUR_CLIENT_ID"
      supportedWallets={[ magicLink({ apiKey: "MAGIC_API_KEY" }) ]}
    >
      <ConnectWallet />
    </ThirdwebProvider>
  );
}`,
      "react-native": `import { ThirdwebProvider, ConnectWallet, magicLink } from "@thirdweb-dev/react-native";

export default function App() {
return (
    <ThirdwebProvider
      clientId="YOUR_CLIENT_ID"
      supportedWallets={[ magicLink({ apiKey: "MAGIC_API_KEY" }) ]}
    >
      <ConnectWallet />
    </ThirdwebProvider>
  );
}`,
      unity: `using Thirdweb;

public async void ConnectWallet()
{
    // Reference to your Thirdweb SDK
    var sdk = ThirdwebManager.Instance.SDK;

    // Configure the connection
    var connection = new WalletConnection(
      provider: WalletProvider.MagicLink,      // The wallet provider you want to connect to (Required)
      chainId: 1,                              // The chain you want to connect to (Required)
      email: "email@email.com"                 // The email you want to authenticate with (Required)
    );

    // Connect the wallet
    string address = await sdk.wallet.Connect(connection);
}`,
    },
  },
] as const;

interface SupportedWalletsSelectorProps {
  selectedLanguage: CodeEnvironment;
  selectedWallet: (typeof WALLETS_SNIPPETS)[number] | null;
  setSelectedWallet: (wallet: (typeof WALLETS_SNIPPETS)[number]) => void;
}

const SupportedWalletsSelector: React.FC<SupportedWalletsSelectorProps> = ({
  selectedLanguage,
  selectedWallet,
  setSelectedWallet,
}) => {
  const sortedWallets = useMemo(() => {
    // sort by language being supported or not
    const supportedWallets = WALLETS_SNIPPETS.filter(
      (wallet) =>
        selectedLanguage in wallet.supportedLanguages &&
        wallet.supportedLanguages[
          selectedLanguage as keyof typeof wallet.supportedLanguages
        ],
    );
    const unsupportedWallets = WALLETS_SNIPPETS.filter(
      (wallet) =>
        !(selectedLanguage in wallet.supportedLanguages) &&
        !wallet.supportedLanguages[
          selectedLanguage as keyof typeof wallet.supportedLanguages
        ],
    );
    return [
      ...supportedWallets,
      ...unsupportedWallets.map((w) => ({ ...w, _isUnsupported: true })),
    ];
  }, [selectedLanguage]);

  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
      {sortedWallets.map((wallet) => {
        const isWalletSupported = !("_isUnsupported" in wallet);
        return (
          <Card
            key={wallet.id}
            onClick={
              isWalletSupported ? () => setSelectedWallet(wallet) : undefined
            }
            as={Flex}
            flexDir="column"
            gap={3}
            p={6}
            _hover={isWalletSupported ? { borderColor: "blue.500" } : {}}
            position="relative"
            cursor={isWalletSupported ? "pointer" : "not-allowed"}
            borderColor={
              wallet.id === selectedWallet?.id ? "blue.500" : "borderColor"
            }
            overflow="hidden"
          >
            <Box opacity={isWalletSupported ? 1 : 0.3}>
              <Flex justifyContent="space-between">
                <Flex alignItems="center" gap={3}>
                  <ChainIcon size={25} ipfsSrc={wallet.iconUrl} />

                  <Heading size="subtitle.sm" as="h3" noOfLines={1}>
                    {wallet.name}
                  </Heading>
                </Flex>
              </Flex>
              <Flex>
                <Flex flexDir="column" gap={1} w="full">
                  <Text opacity={0.6}>{wallet.description}</Text>
                </Flex>
              </Flex>
            </Box>
            {!isWalletSupported && (
              <SimpleGrid
                placeItems="center"
                position="absolute"
                top={0}
                bottom={0}
                right={0}
                left={0}
                backdropFilter="blur(3px)"
                zIndex={1}
              >
                <Heading as="p" size="label.sm">
                  Not yet supported in{" "}
                  <Box as="span" textTransform="capitalize">
                    {selectedLanguage === "react-native"
                      ? "React Native"
                      : selectedLanguage === "javascript"
                      ? "JavaScript"
                      : selectedLanguage}
                  </Box>
                </Heading>
              </SimpleGrid>
            )}
          </Card>
        );
      })}
    </SimpleGrid>
  );
};

const DashboardWalletsWalletSDK: ThirdwebNextPage = () => {
  const signer = useSigner();
  // make this nicer? somehow?
  const network = useChainSlug((signer?.provider as any)?._network?.chainId);

  const [selectedLanguage, setSelectedLanguage] =
    useState<CodeEnvironment>("javascript");

  const [selectedWallet, setSelectedWallet] = useState<
    (typeof WALLETS_SNIPPETS)[number] | null
  >(null);

  const onLanguageSelect = (language: CodeEnvironment) => {
    if (
      selectedWallet &&
      !(language in selectedWallet.supportedLanguages) &&
      !selectedWallet.supportedLanguages[
        language as keyof typeof selectedWallet.supportedLanguages
      ]
    ) {
      setSelectedWallet(null);
    }
    setSelectedLanguage(language);
  };

  return (
    <Flex flexDir="column" gap={16}>
      <Flex direction="column" gap={4}>
        <Heading size="title.lg" as="h1">
          Wallet SDK
        </Heading>
        <Text>
          Full control over wallet connection to your app, game or backend using
          a{" "}
          <Link
            href="https://portal.thirdweb.com/wallet"
            color="blue.400"
            isExternal
          >
            universal wallet interface
          </Link>
          .
        </Text>
        <Flex direction="column" gap={6}>
          <Heading size="subtitle.sm" as="h3">
            Step 1: Pick a language to get started
          </Heading>
          {/* Rendering the code snippet for LocalWallet since it supports all languages */}
          <CodeSegment
            snippet={formatSnippet(
              (WALLETS_SNIPPETS.find((w) => w.id === "local-wallet")
                ?.supportedLanguages || {}) as any,
              {
                contractAddress: "0x...",
                chainName: "base",
              },
            )}
            environment={selectedLanguage}
            setEnvironment={onLanguageSelect}
            onlyTabs
          />
          <Heading size="subtitle.sm" as="h3">
            Step 2: Pick a supported wallet
          </Heading>
          <SupportedWalletsSelector
            selectedLanguage={selectedLanguage}
            selectedWallet={selectedWallet}
            setSelectedWallet={setSelectedWallet}
          />
        </Flex>

        {selectedWallet?.id === "smart-wallet" && (
          <Flex direction="column" gap={4}>
            <Heading size="subtitle.sm" as="h3">
              Step 3: Getting started with Smart Wallet
            </Heading>
            <Flex flexDir="column">
              <Text>
                1. Deploy an account factory contract, you can deploy one in
                1-click via the{" "}
                <Link href="/explore/smart-wallet" isExternal color="blue.500">
                  explore page
                </Link>
                .
              </Text>
              <Text>
                2.{" "}
                <Link
                  href="/dashboard/settings/api-keys"
                  isExternal
                  color="blue.500"
                >
                  Get an API key
                </Link>{" "}
                to access thirdweb&apos;s bundler and paymaster infrastructure,
                which is required for the smart wallet to operate and optionally
                enable gasless transactions.
              </Text>
            </Flex>
          </Flex>
        )}
      </Flex>

      {selectedWallet?.supportedLanguages[
        selectedLanguage as keyof typeof selectedWallet.supportedLanguages
      ] && (
        <Flex direction="column" gap={4}>
          <Heading size="subtitle.sm" as="h3">
            Step {selectedWallet?.id === "smart-wallet" ? "4" : "3"}: Integrate
            into your app
          </Heading>
          <Text>
            Learn more about {selectedWallet.name} integration in{" "}
            <Link href={selectedWallet.link} isExternal color="blue.500">
              our docs
            </Link>
            .
          </Text>
          <CodeSegment
            snippet={formatSnippet(selectedWallet.supportedLanguages as any, {
              contractAddress: "0x...",
              chainName: network ? network.toString() : "goerli",
            })}
            environment={selectedLanguage}
            setEnvironment={setSelectedLanguage}
            hideTabs
          />
        </Flex>
      )}
    </Flex>
  );
};

DashboardWalletsWalletSDK.getLayout = (page, props) => (
  <AppLayout {...props} hasSidebar={true}>
    <WalletsSidebar activePage="wallet-sdk" />
    {page}
  </AppLayout>
);

DashboardWalletsWalletSDK.pageId = PageId.DashboardWalletsWalletSDK;

export default DashboardWalletsWalletSDK;
