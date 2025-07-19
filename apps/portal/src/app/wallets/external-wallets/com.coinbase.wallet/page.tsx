/* eslint-disable @next/next/no-img-element */

import { GlobeIcon } from "lucide-react";
import Image from "next/image";
import { getWalletInfo } from "thirdweb/wallets";
import {
  Breadcrumb,
  CodeBlock,
  createMetadata,
  DocLink,
  Heading,
  Paragraph,
} from "@/components/Document";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const walletId = "com.coinbase.wallet";

export async function generateMetadata() {
  const walletMetadata = await getWalletInfo(walletId);

  return createMetadata({
    description: `Connect ${walletMetadata.name} with thirdweb Connect SDK`,
    image: {
      icon: "wallets",
      title: walletMetadata.name,
    },
    title: walletMetadata.name,
  });
}

export default async function Page() {
  const [walletMetadata, walletImage] = await Promise.all([
    getWalletInfo(walletId),
    getWalletInfo(walletId, true),
  ]);

  return (
    <div>
      <Breadcrumb
        crumbs={[
          {
            href: "/connect/external-wallets",
            name: "External Wallets",
          },
          {
            href: `/connect/external-wallets/${walletId}`,
            name: walletMetadata.name,
          },
        ]}
      />

      <div className="mb-10 flex items-center gap-3 [&_h1]:m-0">
        <Image
          alt=""
          className="rounded-lg"
          height={36}
          src={walletImage}
          width={36}
        />
        <Heading anchorId="title" level={1}>
          {walletMetadata.name}
        </Heading>
      </div>

      <DocLink
        className="flex items-center gap-2"
        href={walletMetadata.homepage}
      >
        <GlobeIcon className="size-5" />
        {walletMetadata.homepage}
      </DocLink>

      <Heading anchorId="wallet-id" level={2}>
        Wallet ID
      </Heading>

      <CodeBlock code={`"${walletId}"`} lang="ts" />

      <Heading anchorId="connect-wallet" level={2}>
        Connect Wallet
      </Heading>

      <Tabs defaultValue="tab-1">
        <TabsList>
          <TabsTrigger value="tab-1"> TypeScript </TabsTrigger>
          <TabsTrigger value="tab-2"> React (Custom UI) </TabsTrigger>
          <TabsTrigger value="tab-3"> React (Component) </TabsTrigger>
        </TabsList>
        <TabsContent value="tab-1">
          <CodeBlock code={injectedSupportedTS()} lang="ts" />
        </TabsContent>
        <TabsContent value="tab-2">
          <CodeBlock code={injectedSupportedCodeReact()} lang="ts" />
        </TabsContent>
        <TabsContent value="tab-3">
          <Paragraph>
            You can add this wallet in the{" "}
            <DocLink href="/react/v5/ConnectButton" target="_blank">
              ConnectButton
            </DocLink>{" "}
            or{" "}
            <DocLink href="/react/v5/ConnectEmbed" target="_blank">
              ConnectEmbed
            </DocLink>{" "}
            component to get a pre-built UI for connecting the wallet.{" "}
            <Heading anchorId="connect-component" level={3}>
              Example
            </Heading>{" "}
            <CodeBlock code={componentCode()} lang="tsx" />
          </Paragraph>
        </TabsContent>
      </Tabs>

      <Heading anchorId="reference" level={2}>
        Reference
      </Heading>

      <DocLink href="/references/typescript/v5/CoinbaseWalletCreationOptions">
        View All Creation Options
      </DocLink>
    </div>
  );
}

function injectedSupportedTS() {
  return `\
import { createThirdwebClient } from "thirdweb";
import { createWallet } from "thirdweb/wallets";

const client = createThirdwebClient({ clientId });

const wallet = ${createWallet()};

await wallet.connect({ client });
`;
}

function injectedSupportedCodeReact() {
  return `\
import { createThirdwebClient } from "thirdweb";
import { useConnect } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";

const client = createThirdwebClient({ clientId });
const wallet = ${createWallet()};

function Example() {
  const { connect, isConnecting, error } = useConnect();
  return (
    <button
      onClick={() => {
        // if the wallet extension is installed, connect to it
        connect(async () => {
            await wallet.connect({ client });
            return wallet;
        });
      }}
    >
      {isConnecting ? "Connecting..." : "Connect"}
    </button>
  );
}
`;
}

function componentCode() {
  return `\
import { ConnectButton } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";

const wallets = [
 // Add your wallet in wallet list
  ${createWallet()},
  // add other wallets...
];

function Example() {
  return (
    <div>
      {/* Use ConnectButton */}
      <ConnectButton client={client} wallets={wallets} />

      {/* Or Use ConnectEmbed */}
      <ConnectEmbed client={client} wallets={wallets} />
    </div>
  );
}`;
}

function createWallet() {
  return `createWallet("${walletId}", {
    appMetadata: {
      name: "My app",
      description: "My app description",
      icon: "https://myapp.com/icon.png",
    },
    // for mobile, pass the callback URL of your app's universal link
    mobileConfig: {
      callbackURL: "https://myapp.com",
    },
    // switch between smart wallet and EOA wallet
    walletConfig: {
      options: "smartWalletOnly", // or "eoaOnly" or "all"
    },
  }),`;
}
