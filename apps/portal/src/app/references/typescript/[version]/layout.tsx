import { getTDocLayout } from "@/app/references/components/TDoc/PageLayout";
import { fetchTypeScriptDoc } from "@/app/references/components/TDoc/fetchDocs/fetchTypeScriptDoc";
import { createMetadata } from "@doc";

export default getTDocLayout({
	getDoc: fetchTypeScriptDoc,
	packageSlug: "typescript",
	sdkTitle: "TypeScript SDK",
});

export const metadata = createMetadata({
	image: {
		title: "thirdweb TypeScript SDK Reference",
		icon: "typescript",
	},
	title: "References | thirdweb TypeScript SDK ",
	description: "Full Reference for thirdweb TypeScript SDK.",
});

export const revalidate = 3600 * 24; // revalidate every day
