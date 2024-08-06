import { DocLayout } from "@/components/Layouts/DocLayout";
import { typescriptV4Sidebar } from "./sidebar";
import { createMetadata } from "@doc";
import { VersionSelector } from "../../../components/others/VersionSelector";

export default async function Layout(props: { children: React.ReactNode }) {
	return (
		<DocLayout
			sideBar={typescriptV4Sidebar}
			editPageButton={true}
			sidebarHeader={
				<div className="flex items-center gap-1">
					<p className="py-5 text-lg font-semibold text-f-100">
						TypeScript SDK
					</p>
					<VersionSelector
						versions={[
							{
								name: "v4",
								href: "/typescript/v4/",
							},
							{
								name: "v5",
								href: "/typescript/v5/",
							},
						]}
						selected="v4"
					/>
				</div>
			}
		>
			{props.children}
		</DocLayout>
	);
}

export const metadata = createMetadata({
	image: {
		title: "thirdweb TypeScript Alpha SDK",
		icon: "typescript",
	},
	title: "thirdweb TypeScript SDK",
	description:
		"A type-safe library to interact with any EVM-compatible blockchain in both Node.js and the browser.",
});
