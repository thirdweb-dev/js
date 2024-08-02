import { createMetadata } from "@/components/Document";
import { DocLayout } from "@/components/Layouts/DocLayout";
import { typescriptV4Sidebar } from "../../typescript/v4/sidebar";
import { TypeScriptVersionSelector } from "../../../components/others/VersionSelector";

export const metadata = createMetadata({
	title: "thirdweb Wallet SDK",
	description:
		"The Wallet SDK allows you to build a fully featured wallet solution or integrate an existing wallet provider with thirdweb's Typescript, React, React Native, and Unity SDKs.",
});

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
