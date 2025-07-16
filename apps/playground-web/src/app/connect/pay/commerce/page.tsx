import type { Metadata } from "next";
import { PageLayout } from "@/components/blocks/APIHeader";
import { CodeExample } from "@/components/code/code-example";
import { BuyMerchPreview } from "@/components/pay/direct-payment";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { metadataBase } from "@/lib/constants";

export const metadata: Metadata = {
  description:
    "The easiest way for users to transact in your app. Onramp users in clicks and generate revenue for each user transaction. Integrate for free.",
  metadataBase,
  title: "Integrate Fiat & Cross-Chain Crypto Payments | thirdweb Payments",
};

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        description={
          <>
            Let your users pay for any service with fiat or crypto on any chain.
          </>
        }
        docsLink="https://portal.thirdweb.com/connect/pay/get-started?utm_source=playground"
        title="Commerce payments with fiat or crypto"
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
