import { Book, CodeIcon, ZapIcon } from "lucide-react";
import type { SideBar } from "../../../components/Layouts/DocLayout";
import { fetchTypeScriptDoc } from "../../references/components/TDoc/fetchDocs/fetchTypeScriptDoc";
import { getCustomTag } from "../../references/components/TDoc/utils/getSidebarLinkgroups";
import { ReactIcon, TypeScriptIcon } from "../../../icons";

const slug = "/react-native/v5";
const docs = await fetchTypeScriptDoc("v5");

export const sidebar: SideBar = {
	name: "Connect React Native SDK",
	links: [
		{
			separator: true,
		},
		{
			name: "Overview",
			href: slug,
		},
		{
			name: "Getting Started",
			href: `${slug}/getting-started`,
			icon: <ZapIcon />,
		},
		{
			name: "Core",
			isCollapsible: false,
			links: [
				{
					name: "Client",
					href: `${slug}/createThirdwebClient`,
				},
				{
					name: "ThirdwebProvider",
					href: `${slug}/ThirdwebProvider`,
				},
				{
					name: "Themes",
					links: [
						{
							name: "Theme Props",
							href: `${slug}/Theme`,
							icon: <CodeIcon />,
						},
						...(docs.functions
							?.filter((f) => {
								const [tag] = getCustomTag(f) || [];
								return tag === "@theme";
							})
							?.map((f) => ({
								name: f.name,
								href: `${slug}/${f.name}`,
								icon: <CodeIcon />,
							})) || []),
					],
				},
				{
					name: "TS reference",
					href: "/typescript/v5",
					icon: <TypeScriptIcon />,
				},
				{
					name: "React reference",
					href: "/react/v5",
					icon: <ReactIcon />,
				},
			],
		},
		{
			name: "Wallets",
			isCollapsible: false,
			links: [
				{
					name: "UI Components",
					links: ["ConnectButton", "ConnectEmbed", "AutoConnect"].map(
						(name) => ({
							name,
							href: `${slug}/${name}`,
							icon: <CodeIcon />,
						}),
					),
				},
				{
					name: "Connection Hooks",
					href: `${slug}/connecting-wallets/hooks`,
					links:
						docs.hooks
							?.filter((hook) => {
								const [tag] = getCustomTag(hook) || [];
								return tag === "@walletConnection";
							})
							?.map((hook) => ({
								name: hook.name,
								href: `${slug}/${hook.name}`,
								icon: <CodeIcon />,
							})) || [],
				},
				{
					name: "Wallet Hooks",
					links:
						docs.hooks
							?.filter((hook) => {
								const [tag] = getCustomTag(hook) || [];
								return tag === "@wallet";
							})
							?.map((hook) => ({
								name: hook.name,
								href: `${slug}/${hook.name}`,
								icon: <CodeIcon />,
							})) || [],
				},
				{
					name: "In-App Wallets",
					links: [
						{
							name: "React API",
							href: "/react/v5/in-app-wallet/get-started",
							icon: <ReactIcon />,
						},
					],
				},
				{
					name: "Account Abstraction",
					links: [
						{
							name: "React API",
							href: "/react/v5/account-abstraction/get-started",
							icon: <ReactIcon />,
						},
					],
				},
				{
					name: "Supported Wallets",
					href: "/typescript/v5/supported-wallets",
					icon: <TypeScriptIcon />,
				},
			],
		},
		{
			name: "Pay",
			isCollapsible: false,
			links: [
				{
					name: "Buy with Fiat",
					links:
						docs.hooks
							?.filter((f) => {
								const [tag] = getCustomTag(f) || [];
								return tag === "@buyCrypto" && f.name.includes("Fiat");
							})
							?.map((f) => ({
								name: f.name,
								href: `${slug}/${f.name}`,
								icon: <CodeIcon />,
							})) || [],
				},
				{
					name: "Buy with Crypto",
					links:
						docs.hooks
							?.filter((f) => {
								const [tag] = getCustomTag(f) || [];
								return tag === "@buyCrypto" && f.name.includes("Crypto");
							})
							?.map((f) => ({
								name: f.name,
								href: `${slug}/${f.name}`,
								icon: <CodeIcon />,
							})) || [],
				},
			],
		},
		{
			name: "Blockchain API",
			isCollapsible: false,
			links: [
				{
					name: "UI Components",
					links: ["TransactionButton"].map((name) => ({
						name,
						href: `${slug}/${name}`,
						icon: <CodeIcon />,
					})),
				},
				{
					name: "Reading State",
					href: `${slug}/reading-state`,
					links:
						docs.hooks
							?.filter((hook) => {
								const [tag] = getCustomTag(hook) || [];
								return tag === "@contract";
							})
							?.map((hook) => ({
								name: hook.name,
								href: `${slug}/${hook.name}`,
								icon: <CodeIcon />,
							})) || [],
				},
				{
					name: "Transactions",
					href: `${slug}/transactions`,
					links:
						docs.hooks
							?.filter((hook) => {
								const [tag] = getCustomTag(hook) || [];
								return tag === "@transaction";
							})
							?.map((hook) => ({
								name: hook.name,
								href: `${slug}/${hook.name}`,
								icon: <CodeIcon />,
							})) || [],
				},
				{
					name: "Extensions",
					links: [
						{
							name: "Using Extensions",
							href: "/react/v5/extensions",
							icon: <Book />,
						},
						{
							name: "Available Extensions",
							href: "/typescript/v5/extensions/built-in",
							icon: <TypeScriptIcon />,
						},
					],
				},
				{
					name: "Core API",
					href: "/typescript/typescript/v5/chain",
					icon: <TypeScriptIcon />,
				},
			],
		},
		{
			separator: true,
		},
		{
			name: "Differences from React",
			href: `${slug}/differences`,
		},
		{
			name: "Full Reference",
			href: "/references/typescript/v5/hooks",
			isCollapsible: false,
		},
	],
};
