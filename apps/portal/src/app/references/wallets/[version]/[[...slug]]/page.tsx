import { getTDocPage } from "@/app/references/components/TDoc/PageLayout";
import { fetchWalletsDoc } from "@/app/references/components/TDoc/fetchDocs/fetchWalletsDoc";

const config = getTDocPage({
  sdkTitle: "Wallets SDK",
  getDoc: fetchWalletsDoc,
  packageSlug: "wallets",
  async getVersions() {
    return ["v2"];
  },
  metadataIcon: "typescript",
});

export default config.default;
export const generateMetadata = config.generateMetadata;
