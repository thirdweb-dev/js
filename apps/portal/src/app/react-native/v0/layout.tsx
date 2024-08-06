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
