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
		}
	],
};
