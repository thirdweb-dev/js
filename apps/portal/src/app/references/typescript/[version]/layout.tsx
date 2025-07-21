import { createMetadata } from "@doc";
import { fetchTypeScriptDoc } from "@/app/references/components/TDoc/fetchDocs/fetchTypeScriptDoc";
import { getTDocLayout } from "@/app/references/components/TDoc/PageLayout";

export default getTDocLayout({
  getDoc: fetchTypeScriptDoc,
  packageSlug: "typescript",
  sdkTitle: "TypeScript SDK",
});

export const metadata = createMetadata({
  description: "Full Reference for thirdweb TypeScript SDK.",
  image: {
    icon: "typescript",
    title: "thirdweb TypeScript SDK Reference",
  },
  title: "References | thirdweb TypeScript SDK ",
});

export const revalidate = 86400; // revalidate every day
