import { PageLayout } from "@/components/blocks/APIHeader";
import { CodeExample } from "@/components/code/code-example";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { StyledBuyWidgetPreview } from "@/components/universal-bridge/buy";
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
        <StyledPayWidget />
      </PageLayout>
    </ThirdwebProvider>
  );
}

function StyledPayWidget() {
  return (
    <CodeExample
      header={{
        title: "Buy Crypto",
        description: (
          <>
            Inline component that allows users to buy any currency.
            <br />
            Customize theme, currency, amounts, payment methods and more.
          </>
        ),
      }}
      preview={<StyledBuyWidgetPreview />}
      code={`\
import { BuyWidget } from "thirdweb/react";

function App() {
  return (
      <BuyWidget
        client={THIRDWEB_CLIENT}
        title="Get Funds"
        tokenAddress={NATIVE_TOKEN_ADDRESS}
        chain={arbitrum}
        amount={toWei("0.002")}
      />
  );
}`}
      lang="tsx"
    />
  );
}
