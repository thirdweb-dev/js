import { BringToFrontIcon } from "lucide-react";
import { PageLayout } from "@/components/blocks/APIHeader";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { createMetadata } from "@/lib/metadata";
import { BridgeWidgetPlayground } from "./components/bridge-playground";

const title = "Bridge Widget";
const description =
  "Easily embed cross-chain token swap and fiat onramp UI into your app";

export const metadata = createMetadata({
  description: description,
  title,
  image: {
    icon: "payments",
    title,
  },
});

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        icon={BringToFrontIcon}
        title={title}
        description={description}
        docsLink="https://portal.thirdweb.com/bridge/bridge-widget?utm_source=playground"
      >
        <BridgeWidgetPlayground />
      </PageLayout>
    </ThirdwebProvider>
  );
}
