import { getTDocLayout } from "@/app/references/components/TDoc/PageLayout";
import { fetchReactNativeDoc } from "@/app/references/components/TDoc/fetchDocs/fetchReactNativeDoc";
import { createMetadata } from "@doc";

export default getTDocLayout({
	getDoc: fetchReactNativeDoc,
	packageSlug: "react-native",
	sdkTitle: "React Native SDK",
});

export const metadata = createMetadata({
	image: {
		title: "thirdweb React Native SDK Reference",
		icon: "react",
	},
	title: "References | thirdweb React Native SDK ",
	description: "Full Reference for thirdweb React Native SDK.",
});
