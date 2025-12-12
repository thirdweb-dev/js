import { ArrowLeftRightIcon } from "lucide-react";
import { PageLayout } from "@/components/blocks/APIHeader";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { createMetadata } from "@/lib/metadata";
import { TransactionPlayground } from "./TransactionPlayground";

const title = "Transaction Widget";
const description =
  "Enable seamless onchain transactions for any contract with fiat or crypto with amounts calculated and automatic execution after funds are confirmed.";
const ogDescription =
  "Power onchain transactions with fiat or crypto payments. Automatically calculate costs and run the transaction post onramp or token swap.";

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
        icon={ArrowLeftRightIcon}
        containerClassName="space-y-12"
        description={description}
        docsLink="https://portal.thirdweb.com/references/typescript/v5/TransactionWidget?utm_source=playground"
        title={title}
      >
        <TransactionPlayground />
      </PageLayout>
    </ThirdwebProvider>
  );
}
