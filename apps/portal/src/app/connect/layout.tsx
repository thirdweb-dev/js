import { DocLayout } from "@/components/Layouts/DocLayout";
import { sidebar } from "./sidebar";
import { PlatformSelector } from "../../components/others/PlatformSelector";

export default async function Layout(props: { children: React.ReactNode }) {
	return (
		<DocLayout
			sideBar={sidebar}
			editPageButton={true}
			sidebarHeader={
				<div className="flex-col items-center gap-1">
					<p className="py-5 text-lg font-semibold text-f-100">Connect</p>
					<PlatformSelector selected="Overview" />
				</div>
			}
		>
			{props.children}
		</DocLayout>
	);
}
