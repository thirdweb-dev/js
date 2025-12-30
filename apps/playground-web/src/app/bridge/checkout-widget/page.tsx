import { CreditCardIcon } from "lucide-react";
import { PageLayout } from "@/components/blocks/APIHeader";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { createMetadata } from "@/lib/metadata";
import { CheckoutPlayground } from "./CheckoutPlayground";

const title = "Checkout Widget";
const description =
  "Enable purchase of any service or goods with fiat or cryptocurrency and setup notifications on every sale to ship goods, activate services, and more";
const ogDescription =
  "Accept fiat or crypto payments on any chain—direct to your wallet. Instant checkout, webhook support, and full control over post-sale actions.";

const validTabs = ["iframe", "react"] as const;
type ValidTabs = (typeof validTabs)[number];

export const metadata = createMetadata({
  description: ogDescription,
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
        icon={CreditCardIcon}
        title={title}
        description={description}
        docsLink="https://portal.thirdweb.com/bridge/checkout-widget?utm_source=playground"
      >
        <CheckoutPlayground defaultTab={validTab} />
      </PageLayout>
    </ThirdwebProvider>
  );
}
