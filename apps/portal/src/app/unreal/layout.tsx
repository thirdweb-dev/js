import { DocLayout } from "@/components/Layouts/DocLayout";
import { sidebar } from "./sidebar";
import { createMetadata } from "@/components/Document";
import { PlatformSelector } from "../../components/others/PlatformSelector";

export default async function Layout(props: { children: React.ReactNode }) {
	return (
		<DocLayout
			sideBar={sidebar}
			editPageButton={true}
			sidebarHeader={
				<div className="flex-col items-center gap-1">
					<p className="py-5 text-lg font-semibold text-f-100">Connect</p>
					<PlatformSelector selected="Unreal" />
				</div>
			}
		>
			{props.children}
		</DocLayout>
	);
}

export const metadata = createMetadata({
	image: {
		title: "thirdweb Unreal SDK",
		icon: "unreal",
	},
	title: "thirdweb Unreal SDK",
	description:
		"Seamlessly create In-App Wallets, sign in with email or socials, unlock Account Abstraction features and more.",
});
