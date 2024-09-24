/* eslint-disable @next/next/no-img-element */

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlobeIcon } from "lucide-react";
import Image from "next/image";
import { getWalletInfo } from "thirdweb/wallets";
import {
  Breadcrumb,
  CodeBlock,
  DocLink,
  Heading,
  Paragraph,
  createMetadata,
} from "../../../../../components/Document";

const walletId = "com.coinbase.wallet";

export async function generateMetadata() {
  const walletMetadata = await getWalletInfo(walletId);

  return createMetadata({
    title: walletMetadata.name,
    description: `Connect ${walletMetadata.name} with thirdweb Connect SDK`,
    image: {
      title: walletMetadata.name,
      icon: "wallets",
    },
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
            href: "/typescript/v5/supported-wallets",
            name: "Supported Wallets",
          },
          {
            href: `/typescript/v5/supported-wallets/${walletId}`,
            name: walletMetadata.name,
          },
        ]}
      />

      <div className="mb-10 flex items-center gap-3 [&_h1]:m-0">
        <Image
          src={walletImage}
          width={36}
          height={36}
          alt=""
          className="rounded-lg"
        />
        <Heading level={1} id="title">
          {walletMetadata.name}
        </Heading>
      </div>

      <DocLink
        href={walletMetadata.homepage}
        className="flex items-center gap-2"
      >
        <GlobeIcon className="size-5" />
        {walletMetadata.homepage}
      </DocLink>

      <Heading level={2} id="wallet-id">
        Wallet ID
      </Heading>

      <CodeBlock lang="ts" code={`"${walletId}"`} />

      <Heading level={2} id="wallet-id">
        Connect Wallet
      </Heading>

      <Tabs defaultValue="tab-1">
        <TabsList>
          <TabsTrigger value="tab-1"> TypeScript </TabsTrigger>
          <TabsTrigger value="tab-2"> React (Custom UI) </TabsTrigger>
          <TabsTrigger value="tab-3"> React (Component) </TabsTrigger>
        </TabsList>
        <TabsContent value="tab-1">
          <CodeBlock lang="ts" code={injectedSupportedTS()} />
        </TabsContent>
        <TabsContent value="tab-2">
          <CodeBlock lang="ts" code={injectedSupportedCodeReact()} />
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
            <Heading level={3} id="connect-component">
              Example
            </Heading>{" "}
            <CodeBlock lang="tsx" code={componentCode()} />
          </Paragraph>
        </TabsContent>
      </Tabs>

      <Heading level={2} id="reference">
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
