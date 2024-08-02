import { DocLayout } from "@/components/Layouts/DocLayout";
import { createMetadata } from "@/components/Document";
import { typescriptV4Sidebar } from "../../typescript/v4/sidebar";
import { TypeScriptVersionSelector } from "../../../components/others/VersionSelector";

export default async function Layout(props: { children: React.ReactNode }) {
	return (
		<DocLayout
			sideBar={typescriptV4Sidebar}
			editPageButton={true}
			sidebarHeader={<TypeScriptVersionSelector selected="v4" />}
		>
			{props.children}
		</DocLayout>
	);
}

export const metadata = createMetadata({
	title: "thirdweb React SDK",
	description:
		"A collection of 100+ React hooks and UI components for your web3 apps, for any EVM-compatible blockchain.",
});
