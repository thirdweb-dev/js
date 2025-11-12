import { CircleDollarSignIcon } from "lucide-react";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { PageLayout } from "../../components/blocks/APIHeader";
import { createMetadata } from "../../lib/metadata";
import { X402Playground } from "./components/X402Playground";

const title = "x402 Payments";
const description =
  "Use the x402 payment protocol to pay for API calls using any web3 wallet.";
const ogDescription =
  "Use the x402 payment protocol to pay for API calls using any web3 wallet.";

export const metadata = createMetadata({
  title,
  description: ogDescription,
  image: {
    icon: "payments",
    title,
  },
});

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        icon={CircleDollarSignIcon}
        title={title}
        description={description}
        docsLink="https://portal.thirdweb.com/x402?utm_source=playground"
      >
        <X402Playground />
      </PageLayout>
    </ThirdwebProvider>
  );
}
