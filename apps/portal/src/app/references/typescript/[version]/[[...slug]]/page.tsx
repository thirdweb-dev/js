import { fetchTypeScriptDoc } from "@/app/references/components/TDoc/fetchDocs/fetchTypeScriptDoc";
import { getTDocPage } from "@/app/references/components/TDoc/PageLayout";

const config = getTDocPage({
  getDoc: fetchTypeScriptDoc,
  async getVersions() {
    return ["v5"];
  },
  metadataIcon: "typescript",
  packageSlug: "typescript",
  sdkTitle: "TypeScript SDK",
});

export default config.default;
export const generateStaticParams = config.generateStaticParams;
export const generateMetadata = config.generateMetadata;

export const revalidate = 86400; // revalidate every day
