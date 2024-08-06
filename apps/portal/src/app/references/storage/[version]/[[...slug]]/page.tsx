import { getTDocPage } from "@/app/references/components/TDoc/PageLayout";
import { fetchStorageDoc } from "@/app/references/components/TDoc/fetchDocs/fetchStorageDoc";

const config = getTDocPage({
  sdkTitle: "Storage SDK",
  getDoc: fetchStorageDoc,
  packageSlug: "storage",
  async getVersions() {
    return ["v2"];
  },
  metadataIcon: "typescript",
});

export default config.default;
// export const generateStaticParams = config.generateStaticParams;
export const generateMetadata = config.generateMetadata;
// export const dynamic = config.dynamic;
