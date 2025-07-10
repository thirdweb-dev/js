import {
	AlbumIcon,
	ArrowLeftRightIcon,
	BracesIcon,
	CircleDollarSignIcon,
	CodeIcon,
	MessageCircleQuestionIcon,
	PaletteIcon,
	RocketIcon,
	TriangleRightIcon,
	WalletIcon,
	WebhookIcon,
	WrenchIcon,
} from "lucide-react";
import type { SideBar } from "@/components/Layouts/DocLayout";

const paySlug = "/payments";

export const sidebar: SideBar = {
	links: [
		{
			href: `${paySlug}`,
			icon: <WalletIcon />,
			name: "Overview",
		},
		{
			href: `${paySlug}/quick-start`,
			icon: <WalletIcon />,
			name: "Overview",
		},
		{
			href: "https://thirdweb.com/routes",
			icon: <ArrowLeftRightIcon />,
			name: "Supported Routes",
		},
		{
			href: `${paySlug}/onramp-providers`,
			icon: <TriangleRightIcon />,
			name: "Onramp Providers",
		},
		{
			href: `${paySlug}/fees`,
			icon: <CircleDollarSignIcon />,
			name: "Service Fees",
		},
		{
			href: `${paySlug}/get-started`,
			icon: <RocketIcon />,
			links: [
				{
					href: `${paySlug}/get-started#installation`,
					name: "Installation",
				},
				{
					href: `${paySlug}/get-started#recipes`,
					name: "Recipes",
				},
			],
			name: "Get Started",
		},
		{
			icon: <AlbumIcon />,
			isCollapsible: true,
			links: [
				{
					href: `${paySlug}/guides/cross-chain-swapping`,
					name: "Cross-Chain Swapping",
				},
				{
					href: `${paySlug}/guides/smart-accounts`,
					name: "Swap with Smart Accounts",
				},
				{
					href: `${paySlug}/guides/onramp-integration`,
					name: "Fiat Onramp",
				},
				{
					href: `${paySlug}/guides/nft-checkout`,
					name: "NFT Checkout",
				},
			],
			name: "Tutorials",
		},
		{
			icon: <PaletteIcon />,
			isCollapsible: true,
			links: [
				{
					href: `${paySlug}/customization/connectbutton`,
					name: "ConnectButton",
				},
				{
					href: `${paySlug}/customization/send-transaction`,
					name: "useSendTransaction",
				},
			],
			name: "Customization",
		},
		{
			href: "https://bridge.thirdweb.com/reference",
			icon: <BracesIcon />,
			name: "API Reference",
		},
		{
			href: "/typescript/v5/buy/quote",
			icon: <CodeIcon />,
			links: [
				{
					href: "/typescript/v5/buy/quote",
					name: "TypeScript SDK",
				},
			],
			name: "SDK Reference",
		},
		{
			href: `${paySlug}/webhooks`,
			icon: <WebhookIcon />,
			name: "Webhooks",
		},
		{
			href: `${paySlug}/troubleshoot`,
			icon: <WrenchIcon />,
			name: "Troubleshoot",
		},
		{
			href: `${paySlug}/faqs`,
			icon: <MessageCircleQuestionIcon />,
			name: "FAQs",
		},
	],
	name: "Payments",
};
