import { APIHeader } from "@/components/blocks/APIHeader";
import { CodeExample } from "@/components/code/code-example";
import { BuyMerchPreview } from "@/components/pay/direct-payment";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { metadataBase } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase,
  title: "Integrate Fiat & Cross-Chain Crypto Payments | thirdweb Pay",
  description:
    "The easiest way for users to transact in your app. Onramp users in clicks and generate revenue for each user transaction. Integrate for free.",
};

export default function Page() {
  return (
    <ThirdwebProvider>
      <main className="container px-0 pb-20">
        <APIHeader
          title="Commerce payments with fiat or crypto"
          description={
            <>
              Let your users pay for any service with fiat or crypto on any
              chain.
            </>
          }
          docsLink="https://portal.thirdweb.com/connect/pay/get-started?utm_source=playground"
          heroLink="/pay.png"
        />

        <section className="space-y-8">
          <BuyMerch />
        </section>
      </main>
    </ThirdwebProvider>
  );
}

function BuyMerch() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="font-semibold text-2xl tracking-tight sm:text-3xl">
          Commerce
        </h2>
        <p className="max-w-[600px]">
          Take payments from Fiat or Crypto directly to your seller wallet.
          <br />
          Get notified for every sale through webhooks, which lets you trigger
          any action you want like shipping physical goods, activating services
          or doing onchain actions.
        </p>
      </div>

      <CodeExample
        preview={<BuyMerchPreview />}
        code={`import { PayEmbed, getDefaultToken } from "thirdweb/react";
          import { base } from "thirdweb/chains";

        function App() {
          return (
            <PayEmbed
              client={client}
              theme={"light"}
              payOptions={{
                mode: "direct_payment",
                paymentInfo: {
                  amount: "35",
                  chain: base,
                  token: getDefaultToken(base, "USDC"),
                  sellerAddress: "0xEb0effdFB4dC5b3d5d3aC6ce29F3ED213E95d675",
                },
                metadata: {
                  name: "Black Hoodie (Size L)",
                  image: "/drip-hoodie.png",
                },
              }}
            />
          );
        };`}
        lang="tsx"
      />
    </>
  );
}
