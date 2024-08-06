import { getTDocPage } from "@/app/references/components/TDoc/PageLayout";
import { fetchReactNativeDoc } from "@/app/references/components/TDoc/fetchDocs/fetchReactNativeDoc";

const config = getTDocPage({
	sdkTitle: "React Native SDK",
	getDoc: fetchReactNativeDoc,
	packageSlug: "react-native",
	async getVersions() {
		return ["v0"];
	},
	metadataIcon: "react",
});

export default config.default;
export const generateStaticParams = config.generateStaticParams;
export const generateMetadata = config.generateMetadata;
export const dynamic = config.dynamic;
