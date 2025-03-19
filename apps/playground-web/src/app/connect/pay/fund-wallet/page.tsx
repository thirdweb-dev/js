import { APIHeader } from "@/components/blocks/APIHeader";
import { CodeExample } from "@/components/code/code-example";
import { StyledPayEmbedPreview } from "@/components/pay/embed";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { metadataBase } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase,
  title: "Fund wallets | thirdweb Universal Bridge",
  description:
    "The easiest way for users to fund their wallets. Onramp users in clicks and generate revenue for each user transaction. Integrate for free.",
};

export default function Page() {
  return (
    <ThirdwebProvider>
      <main className="container px-0 pb-20">
        <APIHeader
          title="The easiest way for users to fund their wallets"
          description={
            <>
              Onramp users with credit card &amp; cross-chain crypto payments —
              and generate revenue for each user transaction.
            </>
          }
          docsLink="https://portal.thirdweb.com/connect/pay/get-started"
          heroLink="/pay.png"
        />

        <section className="space-y-8">
          <StyledPayEmbed />
        </section>
      </main>
    </ThirdwebProvider>
  );
}

function StyledPayEmbed() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="font-semibold text-2xl tracking-tight sm:text-3xl">
          Fund Wallet
        </h2>
        <p className="max-w-[600px]">
          Inline component that allows users to buy any currency.
          <br />
          Customize theme, currency, amounts, payment methods and more.
        </p>
      </div>

      <CodeExample
        preview={<StyledPayEmbedPreview />}
        code={`
        import { PayEmbed } from "thirdweb/react";

        function App() {
          return (
            <PayEmbed
              client={client}
              payOptions={{
                mode: "fund_wallet",
                metadata: {
                  name: "Get funds",
                },
                prefillBuy: {
                  chain: base,
                  amount: "0.01",
                },
                // ... theme, currency, amounts, payment methods, etc.
              }}
          />
        );
        };`}
        lang="tsx"
      />
    </>
  );
}
