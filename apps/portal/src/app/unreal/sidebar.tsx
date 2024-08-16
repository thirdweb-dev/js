import { SideBar } from "@/components/Layouts/DocLayout";
import { ZapIcon } from "lucide-react";

export const sidebar: SideBar = {
	name: "Unreal SDK",
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
			name: "Core",
			isCollapsible: false,
			links: [
				{
					name: "Thirdweb Function Library",
					href: `/unreal/thirdweb-function-library`,
				},
				{
					name: "Thirdweb Subsystem",
					href: `/unreal/thirdweb-subsystem`,
				},
				{
					name: "Thirdweb Wallet Handle",
					href: `/unreal/thirdweb-wallet-handle`,
				},
				{
					name: "Thirdweb Runtime Settings",
					href: `/unreal/thirdweb-runtime-settings`,
				},{
					name: "Thirdweb Common",
					href: `/unreal/thirdweb-common`,
				},
				{
					name: "Thirdweb",
					href: `/unreal/thirdweb`,
				},
			],
		},
		{
			name: "Blueprints",
			isCollapsible: false,
			links: [
				{
					name: "Overview",
					href: "/unreal/blueprints",
				},
			],
		},
	],
};
