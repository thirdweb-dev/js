import { getTDocPage } from "@/app/references/components/TDoc/PageLayout";
import { fetchReactDoc } from "@/app/references/components/TDoc/fetchDocs/fetchReactDoc";

const config = getTDocPage({
  sdkTitle: "React SDK",
  getDoc: fetchReactDoc,
  packageSlug: "react",
  async getVersions() {
    return ["v4"];
  },
  metadataIcon: "react",
});

export default config.default;
export const generateMetadata = config.generateMetadata;
