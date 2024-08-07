import { DocLayout } from "@/components/Layouts/DocLayout";
import { sidebar } from "./sidebar";
import { createMetadata } from "@/components/Document";
import { PlatformSelector } from "../../../components/others/PlatformSelector";

export default async function Layout(props: { children: React.ReactNode }) {
	return (
		<DocLayout
			sideBar={sidebar}
			editPageButton={true}
			sidebarHeader={
				<div className="flex-col items-center gap-1">
					<p className="py-5 text-lg font-semibold text-f-100">Connect</p>
					<PlatformSelector selected="Unity" />
				</div>
			}
		>
			{props.children}
		</DocLayout>
	);
}

export const metadata = createMetadata({
	image: {
		title: "thirdweb Unity SDK",
		icon: "unity",
	},
	title: "thirdweb Unity SDK",
	description:
		"Connect to user's wallets, interact with smart contracts, sign messages, and utilize common standards such as tokens, NFTs, marketplaces; all with built-in RPC URLs, IPFS gateways, and more.",
});
