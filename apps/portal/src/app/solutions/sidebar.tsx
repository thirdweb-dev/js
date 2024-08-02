import { SideBar } from "@/components/Layouts/DocLayout";
import { GamingIcon } from "@/icons";

const solutionsSlug = "/solutions";

export const sidebar: SideBar = {
	name: "Solutions",
	links: [
		{
			name: "Overview",
			href: `${solutionsSlug}`,
		},
		{ separator: true },
		{
			name: "Gaming",
			icon: <GamingIcon />,
			links: [
				{
					name: "Overview",
					href: `${solutionsSlug}/gaming/overview`,
				},
				{
					name: "Unity",
					href: "/unity",
				},
				{
					name: "Unreal Engine",
					links: [
						{
							name: "Quickstart",
							href: `${solutionsSlug}/gaming/unreal-engine/quickstart`,
						},
					],
				},
			],
		},
	],
};
