import { DocLayout } from "@/components/Layouts/DocLayout";
import { sidebar } from "./sidebar";
import { GlossaryBreadcrumb } from "./_components/GlossaryBreadcrumb";

export default async function Layout(props: { children: React.ReactNode }) {
	return (
		<DocLayout sideBar={sidebar} editPageButton={true}>
			<GlossaryBreadcrumb sidebar={sidebar} />
			{props.children}
		</DocLayout>
	);
}
