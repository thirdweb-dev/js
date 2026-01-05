import { BringToFrontIcon } from "lucide-react";
import { PageLayout } from "@/components/blocks/APIHeader";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { createMetadata } from "@/lib/metadata";
import { SwapWidgetPlayground } from "./components/swap-widget-playground";

const title = "Swap Widget";
const description =
  "Embeddable component for users to swap any cryptocurrency with cross-chain support";
const ogDescription =
  "Configure a component to swap cryptocurrency with specified amounts, customization, and more. This interactive playground shows how to customize the component.";

export const metadata = createMetadata({
  description: ogDescription,
  title,
  image: {
    icon: "payments",
    title,
  },
});

export default function Page(props: {
  searchParams: Promise<{ tab?: string }>;
}) {
  return (
    <ThirdwebProvider>
      <PageLayout
        icon={BringToFrontIcon}
        title={title}
        description={description}
        docsLink="https://portal.thirdweb.com/references/typescript/v5/SwapWidget?utm_source=playground"
      >
        <SwapWidgetPlaygroundAsync searchParams={props.searchParams} />
      </PageLayout>
    </ThirdwebProvider>
  );
}

async function SwapWidgetPlaygroundAsync(props: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const searchParams = await props.searchParams;
  const defaultTab =
    searchParams.tab === "iframe" || searchParams.tab === "react"
      ? searchParams.tab
      : undefined;

  return <SwapWidgetPlayground defaultTab={defaultTab} />;
}
