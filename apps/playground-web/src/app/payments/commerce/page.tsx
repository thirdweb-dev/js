import { CreditCardIcon } from "lucide-react";
import { PageLayout } from "@/components/blocks/APIHeader";
import { CodeExample } from "@/components/code/code-example";
import { BuyMerchPreview } from "@/components/pay/direct-payment";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { createMetadata } from "@/lib/metadata";

const title = "Checkout Component";
const description =
  "Enable purchase of any service or goods with fiat or cryptocurrency and setup notifications on every sale to ship goods, activate services, and more";
const ogDescription =
  "Accept fiat or crypto payments on any chain—direct to your wallet. Instant checkout, webhook support, and full control over post-sale actions.";

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
        icon={CreditCardIcon}
        title={title}
        description={description}
        docsLink="https://portal.thirdweb.com/payments?utm_source=playground"
      >
        <BuyMerch />
      </PageLayout>
    </ThirdwebProvider>
  );
}

function BuyMerch() {
  return (
    <CodeExample
      code={`import { CheckoutWidget, getDefaultToken } from "thirdweb/react";
          import { base } from "thirdweb/chains";

        function App() {
          return (
      <CheckoutWidget
        client={THIRDWEB_CLIENT}
        theme="light"
        chain={base}
        amount={"2"}
        tokenAddress="0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
        seller="0xEb0effdFB4dC5b3d5d3aC6ce29F3ED213E95d675"
        feePayer="seller"
        name="Concert Ticket"
        image="https://example.com/concert-ticket.jpg"
        description="Concert ticket for the upcoming show"
      />
          );
        };`}
      header={{
        description: (
          <>
            Take payments from Fiat or Crypto directly to your seller wallet.
            <br />
            Get notified for every sale through webhooks, which lets you trigger
            any action you want like shipping physical goods, activating
            services or doing onchain actions.
          </>
        ),
        title: "Checkout",
      }}
      lang="tsx"
      preview={<BuyMerchPreview />}
    />
  );
}
