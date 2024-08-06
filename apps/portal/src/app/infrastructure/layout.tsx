import { DocLayout } from "@/components/Layouts/DocLayout";
import { sidebar } from "./sidebar";
import { createMetadata } from "@doc";

export default async function Layout(props: { children: React.ReactNode }) {
	return (
		<DocLayout sideBar={sidebar} editPageButton={true} noIndex>
			{props.children}
		</DocLayout>
	);
}

export const metadata = createMetadata({
	title: "thirdweb Infrastructure",
	description:
		"All the infrastructure to scale and build production grade web3 applications",
});
