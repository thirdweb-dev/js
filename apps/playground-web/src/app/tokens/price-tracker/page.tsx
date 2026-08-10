import { TrendingUpIcon } from "lucide-react";
import { PageLayout } from "@/components/blocks/APIHeader";
import { TokenPriceTracker } from "@/components/token-price/token-price-tracker";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { createMetadata } from "@/lib/metadata";

const title = "Price Tracker";
const description =
  "Live token prices, market cap, and 24h volume across chains";

export const metadata = createMetadata({
  title,
  description,
  image: {
    icon: "wallets",
    title,
  },
});

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        containerClassName="space-y-12"
        icon={TrendingUpIcon}
        description={description}
        docsLink="https://portal.thirdweb.com/references/typescript/v5/tokens?utm_source=playground"
        title={title}
      >
        <TokenPriceTracker />
      </PageLayout>
    </ThirdwebProvider>
  );
}
