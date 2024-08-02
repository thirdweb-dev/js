/* eslint-disable @next/next/no-img-element */

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
} from "../../../../../components/Document";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import playStoreSvg from "./assets/playstore.svg";
import chromeStoreSvg from "./assets/chromestore.svg";
import appStoreSvg from "./assets/appstore.svg";
import { GlobeIcon } from "lucide-react";

type PageProps = {
	params: {
		walletId: WalletId;
	};
};

export async function generateMetadata({ params }: PageProps) {
	const walletMetadata = await getWalletInfo(params.walletId);

	return createMetadata({
		title: walletMetadata.name,
		description: `Connect ${walletMetadata.name} with thirdweb Connect SDK`,
		image: {
			title: walletMetadata.name,
			icon: "wallets",
		},
	});
}

export default async function Page(props: PageProps) {
	const [walletMetadata, walletImage] = await Promise.all([
		getWalletInfo(props.params.walletId),
		getWalletInfo(props.params.walletId, true),
	]);

	const isWCSupported =
		walletMetadata.mobile.native || walletMetadata.mobile.universal;

	const isInjectedSupported = walletMetadata.rdns;

	return (
		<div>
			<Breadcrumb
				crumbs={[
					{
						href: "/typescript/v5/supported-wallets",
						name: "Supported Wallets",
					},
					{
						href: `/typescript/v5/supported-wallets/${props.params.walletId}`,
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

			<div className="mb-12 mt-6 flex gap-4">
				{walletMetadata.app.android && (
					<DocLink
						href={walletMetadata.app.android}
						className="transition-transform"
					>
						<Image src={playStoreSvg} height={50} alt="Play Store" />
					</DocLink>
				)}

				{walletMetadata.app.chrome && (
					<DocLink href={walletMetadata.app.chrome}>
						<Image src={chromeStoreSvg} height={50} alt="Play Store" />
					</DocLink>
				)}

				{walletMetadata.app.ios && (
					<DocLink href={walletMetadata.app.ios}>
						<Image src={appStoreSvg} height={50} alt="Play Store" />
					</DocLink>
				)}
			</div>

			<Heading level={2} id="wallet-id">
				Wallet ID
			</Heading>

			<CodeBlock lang="ts" code={`"${props.params.walletId}"`} />

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
					<CodeBlock
						lang="ts"
						code={
							isWCSupported && isInjectedSupported
								? injectedAndWCSupportedCodeTS(props.params.walletId)
								: isInjectedSupported
									? injectedSupportedTS(props.params.walletId)
									: isWCSupported
										? WCSupportedTS(props.params.walletId)
										: "Code not available"
						}
					/>
				</TabsContent>
				<TabsContent value="tab-2">
					<CodeBlock
						lang="ts"
						code={
							isWCSupported && isInjectedSupported
								? injectedAndWCSupportedCodeReact(props.params.walletId)
								: isInjectedSupported
									? injectedSupportedCodeReact(props.params.walletId)
									: isWCSupported
										? WCSupportedCodeReact(props.params.walletId)
										: "Code not available"
						}
					/>
				</TabsContent>
				<TabsContent value="tab-3">
					<Paragraph>
						You can add this wallet in the{" "}
						<DocLink href="/react/v5/ConnectButton" target="_blank">
							{" "}
							ConnectButton{" "}
						</DocLink>{" "}
						or
						<DocLink href="/react/v5/ConnectEmbed" target="_blank">
							{" "}
							ConnectEmbed{" "}
						</DocLink>{" "}
						component to get a pre-built UI for connecting the wallet.
						<Heading level={3} id="connect-component">
							Example
						</Heading>
						<CodeBlock lang="tsx" code={componentCode(props.params.walletId)} />
					</Paragraph>
				</TabsContent>
			</Tabs>
		</div>
	);
}

export async function generateStaticParams(): Promise<PageProps["params"][]> {
	const walletList = await getAllWalletsList();

	return walletList.map((w) => {
		return {
			walletId: w.id,
		};
	});
}

function injectedSupportedTS(id: string) {
	return `\
import { createThirdwebClient } from "thirdweb";
import { createWallet, injectedProvider } from "thirdweb/wallets";

const client = createThirdwebClient({ clientId });

const wallet = createWallet("${id}"); // pass the wallet id

// if the wallet extension is installed, connect to it
if (injectedProvider("${id}")) {
  await wallet.connect({ client });
}

// show error message to user that wallet is not installed
else {
  alert('wallet is not installed');
}
`;
}

function WCSupportedTS(id: string) {
	return `\
import { createThirdwebClient } from "thirdweb";
import { createWallet } from "thirdweb/wallets";

const client = createThirdwebClient({ clientId });

const wallet = createWallet("${id}"); // pass the wallet id

// open WalletConnect modal so user can scan the QR code and connect
await wallet.connect({
  client,
  walletConnect: { showQrModal: true },
});
`;
}

function injectedAndWCSupportedCodeTS(id: string) {
	return `\
import { createThirdwebClient } from "thirdweb";
import { createWallet, injectedProvider } from "thirdweb/wallets";

const client = createThirdwebClient({ clientId });

const wallet = createWallet("${id}"); // pass the wallet id

// if user has wallet installed, connect to it
if (injectedProvider("${id}")) {
  await wallet.connect({ client });
}

// open WalletConnect modal so user can scan the QR code and connect
else {
  await wallet.connect({
    client,
    walletConnect: { showQrModal: true },
  });
}
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

          // if user has wallet installed, connect to it
          if (injectedProvider("${id}")) {
            await wallet.connect({ client });
          }

          // open WalletConnect modal so user can scan the QR code and connect
          else {
            await wallet.connect({
              client,
              walletConnect: { showQrModal: true },
            });
          }

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

          // open WalletConnect modal so user can scan the QR code and connect
          await wallet.connect({
            client,
            walletConnect: { showQrModal: true },
          });

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
        // if the wallet extension is installed, connect to it
        if (injectedProvider("${id}")) {
          connect(async () => {
            const wallet = createWallet("${id}");
            await wallet.connect({ client });
            return wallet;
          });
        }

        // show error message to user that wallet is not installed
        else {
          alert("wallet is not installed");
        }
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
