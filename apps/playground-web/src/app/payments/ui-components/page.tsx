import { BoxIcon } from "lucide-react";
import { PageLayout } from "@/components/blocks/APIHeader";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { createMetadata } from "@/lib/metadata";
import PayEmbedPlayground from "../embed/page";

const title = "Crypto Payments UI Components";
const description =
  "Onramp, swap, & bridge over 1,000+ tokens to enable seamless crypto payments, checkouts, and transactions";
const ogDescription =
  "Onramp, swap, and bridge cryptocurrency with easy to implement components for purchasing crypto, checking out physical or digital goods and services, and executing onchain transactions.";

export const metadata = createMetadata({
  description: ogDescription,
  title,
  image: {
    icon: "payments",
    title,
  },
});

export default function Page(props: {
  searchParams: Promise<{ tab: string }>;
}) {
  return (
    <ThirdwebProvider>
      <PageLayout
        icon={BoxIcon}
        description={description}
        docsLink="https://portal.thirdweb.com/payments?utm_source=playground"
        title={title}
      >
        <PayEmbedPlayground searchParams={props.searchParams} />
      </PageLayout>
    </ThirdwebProvider>
  );
}
