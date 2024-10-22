import type { SideBar } from "@/components/Layouts/DocLayout";
import {
	DotNetIcon,
	EcosystemWalletsIcon,
	PayIcon,
	ReactIcon,
	TypeScriptIcon,
	UnityIcon,
	WalletsAuthIcon,
	WalletsConnectIcon,
	WalletsInAppIcon,
	WalletsSmartIcon,
} from "@/icons";
import { CodeIcon, ExternalLink, ZapIcon } from "lucide-react";
import { UnrealEngineIcon } from "../../icons/sdks/UnrealEngineIcon";

// New Slugs
const onboardingSlug = "/connect/onboarding";
const identitySlug = "/connect/identity";
const transactionsSlug = "/conenct/transactions";

// Old Slugs
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
					name: "Unreal Engine",
					href: "/unreal-engine",
					icon: <UnrealEngineIcon />,
				},
			],
		},
		{ separator: true },
		{
			name: "Learn",
			isCollapsible: false,
			links: [
				// Onboarding
				{
					name: "User Onboarding",
					icon: <WalletsConnectIcon />,
					links: [
						{
							name: "Overview",
							href: `${onboardingSlug}/overview`,
						},
						{
							name: "Get Started",
							// expanded: true,
							links: [
								{
									name: "Connect Button",
									href: `${onboardingSlug}/ConnectButton`,
								},
								{
									name: "Connect Embed",
									href: `${onboardingSlug}/ConnectEmbed`,
								},
								{
									name: "Custom UI",
									href: `${onboardingSlug}/Custom-UI`,
								},
							],
						},
						{
							name: "In-App Wallets",
							links: [
								{
									name: "Overview",
									href: `${onboardingSlug}/in-app-wallet/overview`,
								},
								{
									name: "Email & Phone",
									href: `${onboardingSlug}/in-app-wallet/email-and-phone`,
								},
								{
									name: "Social Login",
									href: `${onboardingSlug}/in-app-wallet/social-logins`,
								},
								{
									name: "Guest Mode",
									href: `${onboardingSlug}/in-app-wallet/guest-mode`,
								},
								{
									name: "Custom Authentication",
									links: [
										{
											name: "Overview",
											href: `${onboardingSlug}/in-app-wallet/custom-auth/overview`,
										},
										{
											name: "Configuration",
											href: `${onboardingSlug}/in-app-wallet/custom-auth/configuration`,
										},
										{
											name: "Guides",
											links: [
												{
													name: "Custom JWT Auth Server",
													href: `${onboardingSlug}/in-app-wallet/custom-auth/custom-jwt-auth-server`,
												},
												{
													name: "Custom Generic Auth Server",
													href: `${onboardingSlug}/in-app-wallet/custom-auth/custom-auth-server`,
												},
												{
													name: "Firebase Auth",
													href: `${onboardingSlug}/in-app-wallet/custom-auth/firebase-auth`,
												},
											],
										},
									],
								},
							],
						},
						{
							name: "External Wallets",
							href: `${onboardingSlug}/external-wallets`,
						},
						{
							name: "Smart Wallets",
							href: `${onboardingSlug}/smart-accounts`,
						},
						// {
						// 	name: "Customization",
						// 	links: [
						// 		{
						// 			name: "Logo",
						// 			href: `${onboardingSlug}/customization#logo`,
						// 		},
						// 		{
						// 			name: "Compact Modal",
						// 			href: `${onboardingSlug}/customization#compact-modal`,
						// 		},
						// 		{
						// 			name: "Theme",
						// 			href: `${onboardingSlug}/customization#theming`,
						// 		},
						// 		{
						// 			name: "Localization",
						// 			href: `${onboardingSlug}/customization#localization`,
						// 		},
						// 	],
						// },
						{
							name: "Funding a Wallet",
							href: `${onboardingSlug}/smart-accounts`,
						},
						{
							name: "Security",
							href: `${onboardingSlug}/security`,
						},
						{
							name: "FAQs",
							href: `${onboardingSlug}/in-app-wallet/faqs`,
						},
					],
				},
				// Ecosystem Wallet
				// {
				// 	name: "Ecosystem Wallets",
				// 	icon: <EcosystemWalletsIcon />,
				// 	links: [
				// 		{
				// 			name: "Overview",
				// 			href: `${ecosystemSlug}/overview`,
				// 		},
				// 		{
				// 			name: "Security",
				// 			href: `${ecosystemSlug}/security`,
				// 		},
				// 		{
				// 			name: "Get Started",
				// 			href: `${ecosystemSlug}/get-started`,
				// 		},
				// 		{
				// 			name: "Managing Ecosystem Permissions",
				// 			href: `${ecosystemSlug}/ecosystem-permissions`,
				// 		},
				// 		{
				// 			name: "Integrating with Partners",
				// 			href: `${ecosystemSlug}/integrating-partners`,
				// 		},
				// 		{
				// 			name: "Pregenerate Wallets",
				// 			href: `${ecosystemSlug}/pregenerate-wallets`,
				// 		},
				// 		{
				// 			name: "Ecosystem Wallet Explorer Page",
				// 			href: `${ecosystemSlug}/wallet-explorer`,
				// 		},
				// 		{
				// 			name: "FAQ",
				// 			href: `${ecosystemSlug}/faq`,
				// 		},
				// 	],
				// },

				// Identity
				{
					name: "Identity Management",
					icon: <WalletsSmartIcon />,
					links: [
						{
							name: "Overview",
							href: `${identitySlug}/account-abstraction/overview`,
						},
						{
							name: "Get Started",
							// expanded: true,
							links: [
								{
									name: "Connect Button",
									href: `${onboardingSlug}/ConnectButton`,
								},
								{
									name: "Connect Embed",
									href: `${onboardingSlug}/ConnectEmbed`,
								},
								{
									name: "Custom UI",
									href: `${onboardingSlug}/Custom-UI`,
								},
							],
						},
						// Account Abstraction
						{
							name: "Account Abstraction",
							links: [
								{
									name: "Overview",
									href: `${identitySlug}/account-abstraction/overview`,
								},

								{
									name: "Account Factories",
									href: `${identitySlug}/account-abstraction/factories`,
								},
								{
									name: "Bundler & Paymaster",
									href: `${identitySlug}/account-abstraction/infrastructure`,
								},
								{
									name: "Sponsorship Rules",
									href: `${identitySlug}/account-abstraction/sponsorship-rules`,
								},
							],
						},
						{
							name: "Authentication (SIWE)",
							links: [
								{
									name: "Overview",
									href: `${identitySlug}/authentication`,
								},
								{
									name: "Frameworks",
									isCollapsible: true,
									expanded: false,
									links: [
										{
											name: "Next.js",
											href: `${identitySlug}/authentication/frameworks/next`,
										},
										{
											name: "React + Express",
											href: `${identitySlug}/authentication/frameworks/react-express`,
										},
									],
								},
								{
									name: "Deploying to Production",
									href: `${identitySlug}/authenitication/deploying-to-production`,
								},
							],
						},
						{
							name: "Linking Profiles",
							href: `${onboardingSlug}/guides/link-multiple-profiles`,
						},
						// {
						// 	name: "Gasless",
						// 	isCollapsible: true,
						// 	links: [
						// 		{
						// 			name: "Engine",
						// 			href: `${aAslug}/gasless/engine`,
						// 		},
						// 		{
						// 			name: "Biconomy",
						// 			href: `${aAslug}/gasless/biconomy`,
						// 		},
						// 		{
						// 			name: "OpenZeppelin",
						// 			href: `${aAslug}/gasless/openzeppelin`,
						// 		},
						// 	],
						// },
						{
							name: "FAQs",
							href: `${identitySlug}/faq`,
						},
					],
				},

				// Transactions
				{
					name: "Onchain Transactions",
					icon: <PayIcon />,
					links: [
						{
							name: "Overview",
							href: `${transactionsSlug}/overview`,
						},
						{
							name: "Get Started",
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
									name: "Unreal Engine",
									href: "/unreal-engine",
									icon: <UnrealEngineIcon />,
								},
							],
						},
						{
							name: "Fiat Transactions",
							links: [
								{
									name: "Overview",
									href: `${paySlug}/overview`,
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
									name: "Testing Pay",
									href: `${paySlug}/testing-pay`,
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
							],
						},
						{
							name: "FAQs",
							href: `${transactionsSlug}/faqs`,
						},
					],
				},
			],
		},
	],
};
