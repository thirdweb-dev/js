import { ShoppingBagIcon } from "lucide-react";
import { PageLayout } from "@/components/blocks/APIHeader";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { createMetadata } from "@/lib/metadata";
import { BuyPlayground } from "./BuyPlayground";

const title = "Buy Widget";
const description =
  "Embeddable component for users to purchase any cryptocurrency for top-ups and more with fiat or crypto-to-crypto swaps";
const ogDescription =
  "Configure a component to buy cryptocurrency with specified amounts, customization, and more. This interactive playground shows how to customize the component.";

export const metadata = createMetadata({
  description: ogDescription,
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
        icon={ShoppingBagIcon}
        title={title}
        description={description}
        docsLink="https://portal.thirdweb.com/wallets/sponsor-gas?utm_source=playground"
      >
        <BuyPlayground />
      </PageLayout>
    </ThirdwebProvider>
  );
}
