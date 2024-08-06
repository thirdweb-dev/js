import { createMetadata } from "@/components/Document";
import { DocLayout } from "@/components/Layouts/DocLayout";
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
	image: {
		title: "thirdweb Storage SDK",
		icon: "storage",
	},
	title: "thirdweb Storage SDK",
	description: "Reference documentation for the thirdweb Storage SDK",
});
