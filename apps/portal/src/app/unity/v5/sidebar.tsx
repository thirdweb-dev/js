import { SideBar } from "@/components/Layouts/DocLayout";
import { ZapIcon } from "lucide-react";

const sdkSlug = "/unity/v5";
const walletProvidersSlug = `${sdkSlug}/wallets`;


export const sidebar: SideBar = {
	name: "Unity SDK",
	links: [
		{ separator: true },
		{
			name: "Overview",
			href: sdkSlug,
		},
		{
			name: "Getting Started",
			href: `${sdkSlug}/getting-started`,
			icon: <ZapIcon />,
		},
		{
			name: "Core",
			isCollapsible: false,
			links: [
				{
					name: "Thirdweb Manager",
					href: `${sdkSlug}/thirdwebmanager`,
				},
			],
		},
		{
			name: "Wallets",
			isCollapsible: false,
			links: [
				{
					name: "In-App Wallet",
					href: `${walletProvidersSlug}/in-app-wallet`,
				},
				{
					name: "Account Abstraction",
					href: `${walletProvidersSlug}/account-abstraction`,
				},
				{
					name: "Private Key Wallet",
					href: `${walletProvidersSlug}/private-key`,
				},
				{
					name: "WalletConnect Wallet",
					href: `${walletProvidersSlug}/walletconnect`,
				},
				{
					name: "MetaMask Wallet (WebGL)",
					href: `${walletProvidersSlug}/metamask`,
				},
			],
		},
		{
			name: "Pay",
			isCollapsible: false,
			links: [
				{
					name: ".NET SDK QuickStart",
					href: "/dotnet/pay/quickstart",
				},
			],
		},
		{
			name: "Blockchain API",
			isCollapsible: false,
			links: [
				{
					name: "Interacting with Contracts",
					href: `${sdkSlug}/contracts`,
				}
			],
		},
	],
};
