import { PageLayout } from "@/components/blocks/APIHeader";
import { CodeExample } from "@/components/code/code-example";
import { StyledPayEmbedPreview } from "@/components/pay/embed";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { metadataBase } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase,
  title: "Buy Crypto | thirdweb Universal Bridge",
  description:
    "The easiest way for users to fund their wallets. Onramp users in clicks and generate revenue for each user transaction. Integrate for free.",
};

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        title="The easiest way for users to fund their wallets"
        description={
          <>
            Onramp users with credit card &amp; cross-chain crypto payments —
            and generate revenue for each user transaction.
          </>
        }
        docsLink="https://portal.thirdweb.com/connect/pay/get-started?utm_source=playground"
      >
        <StyledPayEmbed />
      </PageLayout>
    </ThirdwebProvider>
  );
}

function StyledPayEmbed() {
  return (
    <CodeExample
      header={{
        title: " Buy Crypto",
        description: (
          <>
            Inline component that allows users to buy any currency.
            <br />
            Customize theme, currency, amounts, payment methods and more.
          </>
        ),
      }}
      preview={<StyledPayEmbedPreview />}
      code={`\
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
}`}
      lang="tsx"
    />
  );
}
