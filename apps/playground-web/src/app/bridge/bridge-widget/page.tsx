import { BringToFrontIcon } from "lucide-react";
import { PageLayout } from "@/components/blocks/APIHeader";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { createMetadata } from "@/lib/metadata";
import { BridgeWidgetPlayground } from "./components/bridge-playground";

const title = "Bridge Widget";
const description =
  "Easily embed cross-chain token swap and fiat onramp UI into your app";

const validTabs = ["iframe", "script", "react"] as const;
type ValidTabs = (typeof validTabs)[number];

export const metadata = createMetadata({
  description: description,
  title,
  image: {
    icon: "payments",
    title,
  },
});

export default async function Page(props: {
  searchParams: Promise<{
    tab?: string | undefined | string[];
  }>;
}) {
  const searchParams = await props.searchParams;
  const tab =
    typeof searchParams.tab === "string" ? searchParams.tab : undefined;

  const validTab = validTabs.includes(tab as ValidTabs)
    ? (tab as ValidTabs)
    : undefined;

  return (
    <ThirdwebProvider>
      <PageLayout
        icon={BringToFrontIcon}
        title={title}
        description={description}
        docsLink="https://portal.thirdweb.com/bridge/bridge-widget?utm_source=playground"
      >
        <BridgeWidgetPlayground defaultTab={validTab} />
      </PageLayout>
    </ThirdwebProvider>
  );
}
