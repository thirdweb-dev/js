import type { Metadata } from "next";
import { PageLayout } from "@/components/blocks/APIHeader";
import { CodeExample } from "@/components/code/code-example";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { StyledBuyWidgetPreview } from "@/components/universal-bridge/buy";
import { metadataBase } from "@/lib/constants";

export const metadata: Metadata = {
  description:
    "The easiest way for users to fund their wallets. Onramp users in clicks and generate revenue for each user transaction. Integrate for free.",
  metadataBase,
  title: "Buy Crypto | thirdweb Payments",
};

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        description={
          <>
            Onramp users with credit card &amp; cross-chain crypto payments —
            and generate revenue for each user transaction.
          </>
        }
        docsLink="https://portal.thirdweb.com/wallets/sponsor-gas?utm_source=playground"
        title="The easiest way for users to fund their wallets"
      >
        <StyledPayWidget />
      </PageLayout>
    </ThirdwebProvider>
  );
}

function StyledPayWidget() {
  return (
    <CodeExample
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
      header={{
        description: (
          <>
            Inline component that allows users to buy any currency.
            <br />
            Customize theme, currency, amounts, payment methods and more.
          </>
        ),
        title: "Buy Crypto",
      }}
      lang="tsx"
      preview={<StyledBuyWidgetPreview />}
    />
  );
}
