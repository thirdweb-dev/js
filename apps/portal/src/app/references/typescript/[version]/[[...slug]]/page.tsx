import { getTDocPage } from "@/app/references/components/TDoc/PageLayout";
import { fetchTypeScriptDoc } from "@/app/references/components/TDoc/fetchDocs/fetchTypeScriptDoc";

const config = getTDocPage({
  sdkTitle: "TypeScript SDK",
  getDoc: fetchTypeScriptDoc,
  packageSlug: "typescript",
  async getVersions() {
    return ["v5"];
  },
  metadataIcon: "typescript",
});

export default config.default;
export const generateStaticParams = config.generateStaticParams;
export const generateMetadata = config.generateMetadata;
