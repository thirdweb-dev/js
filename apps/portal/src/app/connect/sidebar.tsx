import type { SideBar } from "@/components/Layouts/DocLayout";
import {
	WalletsAuthIcon,
	WalletsConnectIcon,
	WalletsInAppIcon,
	WalletsSmartIcon,
	PayIcon,
	EcosystemWalletsIcon,
	TypeScriptIcon,
	ReactIcon,
	DotNetIcon,
	UnityIcon,
} from "@/icons";
import { UnrealIcon } from "../../icons/sdks/UnrealIcon";
import { CodeIcon, ExternalLink, ZapIcon } from "lucide-react";

const connectSlug = "/connect/sign-in";
const inAppSlug = "/connect/in-app-wallet";
const aAslug = "/connect/account-abstraction";
const ecosystemSlug = "/connect/ecosystems";
const authSlug = "/connect/auth";
const paySlug = "/connect/pay";

export const sidebar: SideBar = {
	name: "Connect",
	links: [
		{ separator: true },
		{
			name: "Introduction",
			href: "/connect",
		},
		{
			name: "Why thirdweb?",
			href: "/connect/why-thirdweb",
		},
		{
			name: "Quickstart",
			href: "/connect/quickstart",
			icon: <ZapIcon />,
		},
		{
			name: "Playground",
			href: "https://playground.thirdweb.com/",
			icon: <ExternalLink />,
		},
		{
			name: "Templates",
			href: "https://thirdweb.com/templates",
			icon: <ExternalLink />,
		},
		{ separator: true },
		{
			name: "Get Started",
			isCollapsible: false,
			links: [
				{
					name: "TypeScript",
					href: "/typescript/v5",
					icon: <TypeScriptIcon />,
				},
				{
					name: "React",
					href: "/react/v5",
					icon: <ReactIcon />,
				},
				{
					name: "React Native",
					href: "/react-native/v5",
					icon: <ReactIcon />,
				},
				{
					name: "Dotnet",
					href: "/dotnet",
					icon: <DotNetIcon />,
				},
				{
					name: "Unity",
					href: "/unity",
					icon: <UnityIcon />,
				},
				{
					name: "Unreal",
					href: "/unreal",
					icon: <UnrealIcon />,
				},
			],
		},
		{ separator: true },
		{
			name: "Learn",
			isCollapsible: false,
			links: [
				// Connect
				{
					name: "Sign-In",
					icon: <WalletsConnectIcon />,
					links: [
						{
							name: "Overview",
							href: `${connectSlug}/overview`,
						},
						{
							name: "Get Started",
							// expanded: true,
							links: [
								{
									name: "Connect Button",
									href: `${connectSlug}/ConnectButton`,
								},
								{
									name: "Connect Embed",
									href: `${connectSlug}/ConnectEmbed`,
								},
								{
									name: "Custom UI",
									href: `${connectSlug}/Custom-UI`,
								},
							],
						},
						{
							name: "Sign-In Methods",
							links: [
								{
									name: "Email & Phone",
									href: `${connectSlug}/methods/email-and-phone`,
								},
								{
									name: "Social Login",
									href: `${connectSlug}/methods/social-logins`,
								},
								{
									name: "External Wallets",
									href: `${connectSlug}/methods/external-wallets`,
								},
							],
						},
						{
							name: "Customization",
							links: [
								{
									name: "Logo",
									href: `${connectSlug}/customization#logo`,
								},
								{
									name: "Compact Modal",
									href: `${connectSlug}/customization#compact-modal`,
								},
								{
									name: "Theme",
									href: `${connectSlug}/customization#theming`,
								},
								{
									name: "Localization",
									href: `${connectSlug}/customization#localization`,
								},
							],
						},
						{
							name: "Playground",
							href: "https://playground.thirdweb.com/connect/sign-in/button",
						},
					],
				},

				//In-App Wallets
				{
					name: "In-App Wallet",
					icon: <WalletsInAppIcon />,
					links: [
						{
							name: "Overview",
							href: `${inAppSlug}/overview`,
						},
						{
							name: "How it works",
							href: `${inAppSlug}/how-it-works`,
						},
						{
							name: "Get Started",
							links: [
								{
									name: "TypeScript",
									href: "/typescript/v5/inAppWallet",
									icon: <TypeScriptIcon />,
								},
								{
									name: "React",
									href: "/react/v5/in-app-wallet/get-started",
									icon: <ReactIcon />,
								},
								{
									name: "React Native",
									// TODO - add react-native dedicated page
									href: "/react/v5/in-app-wallet/get-started",
									icon: <ReactIcon />,
								},
								{
									name: "Dotnet",
									href: "/dotnet/wallets/providers/in-app-wallet",
									icon: <DotNetIcon />,
								},
								{
									name: "Unity",
									href: "/unity/wallets/providers/in-app-wallet",
									icon: <UnityIcon />,
								},
							],
						},
						{
							name: "Custom Authentication",
							links: [
								{
									name: "Overview",
									href: `${inAppSlug}/custom-auth/overview`,
								},
								{
									name: "Configuration",
									href: `${inAppSlug}/custom-auth/configuration`,
								},
								{
									name: "Integration guides",
									links: [
										{
											name: "Custom auth server (OIDC Auth)",
											href: `${inAppSlug}/custom-auth/custom-jwt-auth-server`,
										},
										{
											name: "Custom auth server (Generic Auth)",
											href: `${inAppSlug}/custom-auth/custom-auth-server`,
										},
										{
											name: "Firebase Auth",
											href: `${inAppSlug}/custom-auth/firebase-auth`,
										},
									],
								},
							],
						},
						{
							name: "Backend APIs",
							href: `${inAppSlug}/how-to/get-in-app-wallet-details-on-server`,
						},
						{
							name: "FAQs",
							href: `${inAppSlug}/faqs`,
						},
					],
				},
				// Ecosystem Wallet
				{
					name: "Ecosystem Wallets",
					icon: <EcosystemWalletsIcon />,
					links: [
						{
							name: "Overview",
							href: `${ecosystemSlug}/overview`,
						},
						{
							name: "Get Started",
							href: `${ecosystemSlug}/get-started`,
						},
						{
							name: "Managing Ecosystem Permissions",
							href: `${ecosystemSlug}/ecosystem-permissions`,
						},
						{
							name: "Integrating with Partners",
							href: `${ecosystemSlug}/integrating-partners`,
						},

						{
							name: "Ecosystem Wallet Explorer Page",
							href: `${ecosystemSlug}/wallet-explorer`,
						},
						{
							name: "FAQ",
							href: `${ecosystemSlug}/faq`,
						},
					],
				},
				//Account abstraction
				{
					name: "Account Abstraction",
					icon: <WalletsSmartIcon />,
					links: [
						{
							name: "Overview",
							href: `${aAslug}/overview`,
						},
						{
							name: "How it Works",
							href: `${aAslug}/how-it-works`,
						},
						{
							name: "Get Started",
							links: [
								{
									name: "TypeScript",
									href: "/typescript/v5/account-abstraction/get-started",
									icon: <TypeScriptIcon />,
								},
								{
									name: "React",
									href: "/react/v5/account-abstraction/get-started",
									icon: <ReactIcon />,
								},
								{
									name: "React Native",
									// TODO - add react-native dedicated page
									href: "/react/v5/account-abstraction/get-started",
									icon: <ReactIcon />,
								},
								{
									name: "Dotnet",
									href: "/dotnet/wallets/providers/account-abstraction",
									icon: <DotNetIcon />,
								},
								{
									name: "Unity",
									href: "/unity/wallets/providers/account-abstraction",
									icon: <UnityIcon />,
								},
							],
						},
						{
							name: "Account Factories",
							href: `${aAslug}/factories`,
						},
						{
							name: "Bundler & Paymaster",
							href: `${aAslug}/infrastructure`,
						},
						{
							name: "Sponsorship rules",
							href: `${aAslug}/sponsorship-rules`,
						},
						{
							name: "Gasless",
							isCollapsible: true,
							links: [
								{
									name: "Engine",
									href: `${aAslug}/gasless/engine`,
								},
								{
									name: "Biconomy",
									href: `${aAslug}/gasless/biconomy`,
								},
								{
									name: "OpenZeppelin",
									href: `${aAslug}/gasless/openzeppelin`,
								},
							],
						},
						// {
						// 	name: "References",
						// 	isCollapsible: true,
						// 	expanded: true,
						// 	links: [
						// 		{
						// 			name: "React",
						// 			href: `/references/typescript/v5/smartWallet`,
						// 		},
						// 		{
						// 			name: "React Native",
						// 			href: `/react-native/v0/wallets/smartwallet`,
						// 		},
						// 		{
						// 			name: "TypeScript",
						// 			href: `/references/wallets/v2/SmartWallet`,
						// 		},
						// 		{
						// 			name: "Unity",
						// 			href: `/unity/wallets/providers/smart-wallet`,
						// 		},
						// 	],
						// },
						{
							name: "FAQs",
							href: `${aAslug}/faq`,
						},
					],
				},
				// Auth
				{
					name: "Auth (SIWE)",
					icon: <WalletsAuthIcon />,
					links: [
						{
							name: "Get Started",
							href: `${authSlug}`,
						},
						{
							name: "Frameworks",
							isCollapsible: true,
							expanded: false,
							links: [
								{
									name: "Next.js",
									href: `${authSlug}/frameworks/next`,
								},
								{
									name: "React + Express",
									href: `${authSlug}/frameworks/react-express`,
								},
							],
						},
						{
							name: "Deploying to Production",
							href: `${authSlug}/deploying-to-production`,
						},
					],
				},
				// Pay
				{
					name: "Pay",
					icon: <PayIcon />,
					links: [
						{
							name: "Overview",
							href: `${paySlug}/overview`,
						},
						{
							name: "Get Started",
							href: `${paySlug}/get-started`,
							expanded: true,
							links: [
								{
									name: "ConnectButton",
									href: `${paySlug}/get-started#option-1-connectbutton`,
								},
								{
									name: "Embed Pay",
									href: `${paySlug}/get-started#option-2-embed-pay`,
								},
								{
									name: "Send a Transaction",
									href: `${paySlug}/get-started#option-3-send-a-transaction-with-pay`,
								},
							],
						},
						{
							name: "Supported Chains",
							href: `${paySlug}/supported-chains`,
						},

						{
							name: "Fee Sharing",
							href: `${paySlug}/fee-sharing`,
						},

						{
							name: "Webhooks",
							href: `${paySlug}/webhooks`,
						},

						{
							name: "Guides",
							isCollapsible: true,

							links: [
								{
									name: "Accept Direct Payments",
									href: `${paySlug}/guides/accept-direct-payments`,
								},
								{
									name: "Build a Custom Experience",
									href: `${paySlug}/guides/build-a-custom-experience`,
								},
								{
									name: "Enable Test Mode",
									href: `${paySlug}/guides/test-mode`,
								},
							],
						},
						{
							name: "Customization",
							isCollapsible: true,

							links: [
								{
									name: "ConnectButton",
									href: `${paySlug}/customization/connectbutton`,
								},
								{
									name: "PayEmbed",
									href: `${paySlug}/customization/payembed`,
								},
								{
									name: "useSendTransaction",
									href: `${paySlug}/customization/send-transaction`,
								},
							],
						},
						{
							name: "FAQs",
							href: `${paySlug}/faqs`,
						},
					],
				},
				// Blockchain API
				{
					name: "Blockchain API",
					icon: <CodeIcon />,
					href: "/connect/blockchain-api",
					links: [
						{
							name: "TypeScript",
							href: "/typescript/v5",
							icon: <TypeScriptIcon />,
						},
						{
							name: "React",
							href: "/react/v5",
							icon: <ReactIcon />,
						},
						{
							name: "React Native",
							href: "/react-native/v5",
							icon: <ReactIcon />,
						},
						{
							name: "Dotnet",
							href: "/dotnet",
							icon: <DotNetIcon />,
						},
						{
							name: "Unity",
							href: "/unity",
							icon: <UnityIcon />,
						},
						{
							name: "Unreal",
							href: "/unreal",
							icon: <UnrealIcon />,
						},
					],
				},
			],
		},
	],
};
