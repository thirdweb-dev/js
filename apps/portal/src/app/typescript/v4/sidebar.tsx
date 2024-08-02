import { SideBar } from "@/components/Layouts/DocLayout";
import { ReactIcon } from "../../../icons";
import type { SidebarLink } from "../../../components/others/Sidebar";
import { WalletsConnectIcon } from "@/icons/products/wallets/WalletsConnectIcon";
import { InfraStorageIcon } from "@/icons/products/infra/InfraStorageIcon";

function getReactSideBar(): SidebarLink {
	const sdkSlug = "/react/v4";
	const referenceSlug = "/references/react/v4";
	const componentsSlug = "/react/v4/components";

	return {
		icon: <ReactIcon className="size-4" />,
		name: "React SDK",
		links: [
			{
				name: "Overview",
				href: sdkSlug,
			},
			{
				name: "Getting Started",
				href: `${sdkSlug}/getting-started`,
			},
			{
				name: "ThirdwebProvider",
				href: `${sdkSlug}/ThirdwebProvider`,
			},
			{
				name: "ThirdwebSDKProvider",
				href: `${sdkSlug}/ThirdwebSDKProvider`,
			},
			{
				name: "Connecting Wallets",
				href: `${sdkSlug}/connecting-wallets`,
				links: [
					{
						name: "Custom UI",
						href: `${sdkSlug}/connecting-wallets/custom-ui`,
					},
				],
			},
			{
				name: "Wallets",
				href: `${sdkSlug}/wallets`,
			},
			{
				name: "Components",
				links: [
					{
						name: "ConnectWallet",
						href: `${componentsSlug}/ConnectWallet`,
					},
					{
						name: "ConnectEmbed",
						href: `${componentsSlug}/ConnectEmbed`,
					},
					{
						name: "Web3Button",
						href: `${componentsSlug}/Web3Button`,
					},
					{
						name: "ThirdwebNftMedia",
						href: `${componentsSlug}/ThirdwebNftMedia`,
					},
					{
						name: "MediaRenderer",
						href: `${componentsSlug}/MediaRenderer`,
					},
				],
			},
			{
				name: "Hooks",
				href: `${referenceSlug}/hooks`,
			},
			{
				name: "Full Reference",
				href: referenceSlug,
			},
		],
	};
}

function getReactNativeSidebar(): SidebarLink {
	const sdkSlug = "/react-native/v0";
	const walletsSlug = "/react-native/v0/wallets";
	const componentsSlug = "/react-native/v0/components";
	const referencesSlug = "/references/react-native/v0";

	return {
		name: "React Native SDK",
		icon: <ReactIcon className="size-4" />,
		links: [
			{
				name: "Overview",
				href: sdkSlug,
			},
			{
				name: "Installation",
				href: `${sdkSlug}/installation`,
			},
			{
				name: "Getting Started",
				href: `${sdkSlug}/getting-started`,
			},
			{
				name: "ThirdwebProvider",
				href: `${sdkSlug}/ThirdwebProvider`,
			},
			{
				name: "ThirdwebSDKProvider",
				href: `${sdkSlug}/ThirdwebSDKProvider`,
			},
			{
				name: "Connecting Wallets",
				href: `${sdkSlug}/connecting-wallets`,
				links: [
					{
						name: "Custom UI",
						href: `${sdkSlug}/connecting-wallets/custom-ui`,
					},
				],
			},
			{
				name: "Wallets",
				href: walletsSlug,
				links: [
					{
						name: "Coinbase Wallet",
						href: `${walletsSlug}/coinbase`,
					},
					{
						name: "In-App Wallet",
						href: `${walletsSlug}/in-app-wallet`,
					},
					{
						name: "Local Wallet",
						href: `${walletsSlug}/local-wallet`,
					},
					{
						name: "Magic Link",
						href: `${walletsSlug}/magiclink`,
					},
					{
						name: "MetaMask Wallet",
						href: `${walletsSlug}/metamask`,
					},
					{
						name: "Rainbow Wallet",
						href: `${walletsSlug}/rainbow`,
					},
					{
						name: "Smart Account (Account Abstraction)",
						href: `${walletsSlug}/smartwallet`,
					},
					{
						name: "Trust Wallet",
						href: `${walletsSlug}/trust`,
					},
					{
						name: "WalletConnect",
						href: `${walletsSlug}/walletconnect`,
					},
				],
			},
			{
				name: "UI Components",
				links: [
					{
						name: "ConnectWallet",
						href: `${componentsSlug}/ConnectWallet`,
					},
					{
						name: "ConnectEmbed",
						href: `${componentsSlug}/ConnectEmbed`,
					},
					{
						name: "Web3Button",
						href: `${componentsSlug}/Web3Button`,
					},
				],
			},
			{
				name: "Hooks",
				href: `${referencesSlug}/hooks`,
			},
			{
				name: "FAQ",
				href: `${sdkSlug}/faq`,
			},
			{
				name: "Full Reference",
				href: referencesSlug,
			},
		],
	};
}

function getWalletSDKSidebar(): SidebarLink {
	return {
		name: "Wallet SDK",
		icon: <WalletsConnectIcon className="size-4" />,
		links: [
			{
				name: "Overview",
				href: "/wallet-sdk/v2",
			},
			{
				name: "Usage",
				href: "/wallet-sdk/v2/usage",
			},
			{
				name: "Wallets",
				href: "/wallet-sdk/v2/wallets",
			},
			{
				name: "Build a Wallet",
				href: "/wallet-sdk/v2/build",
				links: [
					{
						name: "Wallet interface",
						href: "/wallet-sdk/v2/build/connector",
					},
					{
						name: "ConnectWallet integration",
						href: "/wallet-sdk/v2/build/connect-wallet-integration",
					},
				],
			},
			{
				name: "Full Reference",
				href: "/references/wallets/v2",
			},
		],
	};
}

function getStorageSDKSidebar(): SidebarLink {
	return {
		name: "Storage SDK",
		icon: <InfraStorageIcon className="size-4" />,
		links: [
			{
				name: "Overview",
				href: "/storage-sdk/v2",
			},
			{
				name: "Full Reference",
				href: "/references/storage/v2",
			},
		],
	};
}

export const typescriptV4Sidebar: SideBar = {
	name: "TypeScript SDK",
	links: [
		{
			name: "Overview",
			href: "/typescript/v4",
		},
		{
			name: "Getting Started",
			href: "/typescript/v4/getting-started",
		},
		{
			name: "Deploying Contracts",
			href: "/typescript/v4/deploy",
		},
		{
			name: "Interacting With Contracts",
			href: "/typescript/v4/interact",
		},
		{
			name: "Extensions Framework",
			href: "/typescript/v4/extensions",
		},
		{
			name: "Contract utilities",
			href: "/typescript/v4/utilities",
		},
		{
			name: "Full Reference",
			href: "/references/typescript/v4",
		},
		{
			separator: true,
		},
		getReactSideBar(),
		{
			separator: true,
		},
		getReactNativeSidebar(),
		{
			separator: true,
		},
		getWalletSDKSidebar(),
		{
			separator: true,
		},
		getStorageSDKSidebar(),
	],
};
