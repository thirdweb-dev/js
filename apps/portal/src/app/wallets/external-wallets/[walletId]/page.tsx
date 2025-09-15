/* eslint-disable @next/next/no-img-element */

import { GlobeIcon } from "lucide-react";
import Image from "next/image";
import {
  getAllWalletsList,
  getWalletInfo,
  type WalletId,
} from "thirdweb/wallets";
import {
  Breadcrumb,
  CodeBlock,
  createMetadata,
  DocLink,
  Heading,
  Paragraph,
} from "@/components/Document";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import appStoreSvg from "./assets/appstore.svg";
import chromeStoreSvg from "./assets/chromestore.svg";
import playStoreSvg from "./assets/playstore.svg";

type PageProps = {
  params: Promise<{
    walletId: WalletId;
  }>;
};

export async function generateMetadata(props: PageProps) {
  const params = await props.params;
  const walletMetadata = await getWalletInfo(params.walletId);

  return createMetadata({
    description: `Connect ${walletMetadata.name} with the thirdweb SDK`,
    image: {
      icon: "wallets",
      title: walletMetadata.name,
    },
    title: walletMetadata.name,
  });
}

export default async function Page(props: PageProps) {
  const params = await props.params;
  const [walletMetadata, walletImage] = await Promise.all([
    getWalletInfo(params.walletId),
    getWalletInfo(params.walletId, true),
  ]);

  const isWCSupported =
    walletMetadata.mobile.native || walletMetadata.mobile.universal;

  const isInjectedSupported = walletMetadata.rdns;

  return (
    <div>
      <Breadcrumb
        crumbs={[
          {
            href: "/wallets/external-wallets",
            name: "External Wallets",
          },
          {
            href: `/wallets/external-wallets/${params.walletId}`,
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
      <div className="mt-6 mb-12 flex gap-4">
        {walletMetadata.app.android && (
          <DocLink
            className="transition-transform"
            href={walletMetadata.app.android}
          >
            <Image alt="Play Store" height={50} src={playStoreSvg} />
          </DocLink>
        )}

        {walletMetadata.app.chrome && (
          <DocLink href={walletMetadata.app.chrome}>
            <Image alt="Play Store" height={50} src={chromeStoreSvg} />
          </DocLink>
        )}

        {walletMetadata.app.ios && (
          <DocLink href={walletMetadata.app.ios}>
            <Image alt="Play Store" height={50} src={appStoreSvg} />
          </DocLink>
        )}
      </div>
      <Heading anchorId="wallet-id" level={2}>
        Wallet ID
      </Heading>
      <CodeBlock code={`"${params.walletId}"`} lang="ts" />
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
          <CodeBlock
            code={
              isWCSupported && isInjectedSupported
                ? injectedAndWCSupportedCodeTS(params.walletId)
                : isInjectedSupported
                  ? injectedSupportedTS(params.walletId)
                  : isWCSupported
                    ? WCSupportedTS(params.walletId)
                    : "Code not available"
            }
            lang="ts"
          />
        </TabsContent>
        <TabsContent value="tab-2">
          <CodeBlock
            code={
              isWCSupported && isInjectedSupported
                ? injectedAndWCSupportedCodeReact(params.walletId)
                : isInjectedSupported
                  ? injectedSupportedCodeReact(params.walletId)
                  : isWCSupported
                    ? WCSupportedCodeReact(params.walletId)
                    : "Code not available"
            }
            lang="ts"
          />
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
            component to get a pre-built UI for connecting the wallet.
            <Heading anchorId="connect-component" level={3}>
              Example
            </Heading>
            <CodeBlock code={componentCode(params.walletId)} lang="tsx" />
          </Paragraph>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export async function generateStaticParams(): Promise<PageProps["params"][]> {
  const walletList = await getAllWalletsList();

  return walletList.map((w) => {
    return Promise.resolve({
      walletId: w.id,
    });
  });
}

function injectedSupportedTS(id: string) {
  return `\
import { createThirdwebClient } from "thirdweb";
import { createWallet, injectedProvider } from "thirdweb/wallets";

const client = createThirdwebClient({ clientId });

const wallet = createWallet("${id}"); // pass the wallet id
await wallet.connect({ client });
`;
}

function WCSupportedTS(id: string) {
  return `\
import { createThirdwebClient } from "thirdweb";
import { createWallet } from "thirdweb/wallets";

const client = createThirdwebClient({ clientId });

const wallet = createWallet("${id}"); // pass the wallet id
await wallet.connect({ client });
`;
}

function injectedAndWCSupportedCodeTS(id: string) {
  return `\
import { createThirdwebClient } from "thirdweb";
import { createWallet, injectedProvider } from "thirdweb/wallets";

const client = createThirdwebClient({ clientId });

const wallet = createWallet("${id}"); // pass the wallet id
// if user has wallet installed, connects to it, otherwise opens a WalletConnect modal
await wallet.connect({ client });
`;
}

function injectedAndWCSupportedCodeReact(id: string) {
  return `\
import { createThirdwebClient } from "thirdweb";
import { useConnect } from "thirdweb/react";
import { createWallet, injectedProvider } from "thirdweb/wallets";

const client = createThirdwebClient({ clientId });

function Example() {
  const { connect, isConnecting, error } = useConnect();
  return (
    <button
      onClick={() =>
        connect(async () => {
          const wallet = createWallet("${id}"); // pass the wallet id
          await wallet.connect({ client });
          // return the wallet to set it as active wallet
          return wallet;
        })
      }
    >
      {isConnecting ? "Connecting..." : "Connect"}
    </button>
  );
}
`;
}

function WCSupportedCodeReact(id: string) {
  return `\
import { createThirdwebClient } from "thirdweb";
import { useConnect } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";

const client = createThirdwebClient({ clientId });

function Example() {
  const { connect, isConnecting, error } = useConnect();
  return (
    <button
      onClick={() =>
        connect(async () => {
          const wallet = createWallet("${id}"); // pass the wallet id
          await wallet.connect({ client });
          // return the wallet to set it as active wallet
          return wallet;
        })
      }
    >
      {isConnecting ? "Connecting..." : "Connect"}
    </button>
  );
}
`;
}

function injectedSupportedCodeReact(id: string) {
  return `\
import { createThirdwebClient } from "thirdweb";
import { useConnect } from "thirdweb/react";
import { createWallet, injectedProvider } from "thirdweb/wallets";

const client = createThirdwebClient({ clientId });

function Example() {
  const { connect, isConnecting, error } = useConnect();
  return (
    <button
      onClick={() => {
        // if the wallet extension is installed, connect to it, otherwise opens a WalletConnect modal
        connect(async () => {
          const wallet = createWallet("${id}");
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

function componentCode(id: string) {
  return `\
import { ConnectButton } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";

const wallets = [
  createWallet("${id}"), // Add your wallet in wallet list
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
