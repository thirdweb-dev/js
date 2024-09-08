import { SideBar } from "@/components/Layouts/DocLayout";
import { ZapIcon } from "lucide-react";

export const sidebar: SideBar = {
	name: "Unreal Engine SDK",
	links: [
		{ separator: true },
		{
			name: "Overview",
			href: "/unreal",
		},
		{
			name: "Getting Started",
			href: "/unreal/getting-started",
			icon: <ZapIcon />,
		},
		{
			name: "Blueprints",
			isCollapsible: true,
			links: [
				{
					name: "Overview",
					href: "/unreal/blueprints",
				},
				{
					name: "Private Key Wallets",
					href: `/unreal/blueprints/private-key-wallet`,
				},
				{
					name: "In App Wallets",
					href: `/unreal/blueprints/in-app-wallet`,
				},
				{
					name: "Smart Wallets",
					href: `/unreal/blueprints/smart-wallet`,
				},
				{
					name: "Utilities",
					href: `/unreal/blueprints/utilities`,
				},
			],
		},
		{
			name: "C++",
			isCollapsible: true,
			links: [
				{
					name: "Namespaces",
					isCollapsible: false,
					links: [
						{
							name: "Thirdweb",
							href: `/unreal/cpp/thirdweb`,
						},
						{
							name: "ThirdwebUtils",
							href: "/unreal/cpp/thirdweb-utils",
						},
					],
				},
				{
					name: "Classes",
					isCollapsible: false,
					links: [
						{
							name: "Common",
							href: `/unreal/cpp/common`,
						},
						{
							name: "Runtime Settings",
							href: `/unreal/cpp/runtime-settings`,
						},
						{
							name: "Wallet Handle",
							href: `/unreal/cpp/wallet-handle`,
						},
					],
				},
			],
		},
	],
};
