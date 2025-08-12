import { ShoppingBagIcon } from "lucide-react";
import { PageLayout } from "@/components/blocks/APIHeader";
import { CodeExample } from "@/components/code/code-example";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { StyledBuyWidgetPreview } from "@/components/universal-bridge/buy";
import { createMetadata } from "@/lib/metadata";

const title = "Buy Crypto Component";
const description =
  "Embeddable component for users to purchase any cryptocurrency for top-ups and more with fiat or crypto-to-crypto swaps";
const ogDescription =
  "Configure a component to buy cryptocurrency with specified amounts, customization, and more. This interactive playground shows how to customize the component.";

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
        icon={ShoppingBagIcon}
        title={title}
        description={description}
        docsLink="https://portal.thirdweb.com/wallets/sponsor-gas?utm_source=playground"
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
