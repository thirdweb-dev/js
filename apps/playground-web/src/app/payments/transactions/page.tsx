import { ArrowLeftRightIcon } from "lucide-react";
import { PageLayout } from "@/components/blocks/APIHeader";
import { CodeExample } from "@/components/code/code-example";
import { PayTransactionButtonPreview } from "@/components/pay/transaction-button";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { createMetadata } from "@/lib/metadata";
import { TransactionPlayground } from "./TransactionPlayground";

const title = "Onchain Transaction Components";
const description =
  "Enable seamless onchain transactions for any contract with fiat or crypto with amounts calculated and automatic execution after funds are confirmed.";
const ogDescription =
  "Power onchain transactions with fiat or crypto payments. Automatically calculate costs and run the transaction post onramp or token swap.";

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
        icon={ArrowLeftRightIcon}
        containerClassName="space-y-12"
        description={description}
        docsLink="https://portal.thirdweb.com/wallets/sponsor-gas?utm_source=playground"
        title={title}
      >
        <div>
          <h2 className="text-xl font-semibold tracking-tight mb-1">
            Transaction Widget
          </h2>
          <p className="text-base text-muted-foreground mb-6">
            Render a prebuilt UI for performing transactions using any token or
            fiat. <br /> It handles the complete payment flow, supporting both
            crypto and fiat payments across 50+ chains.
          </p>
          <TransactionPlayground />
        </div>
        <NoFundsPopup />
      </PageLayout>
    </ThirdwebProvider>
  );
}

function NoFundsPopup() {
  return (
    <CodeExample
      code={`
import { transfer } from "thirdweb/extensions/erc20";
import { TransactionButton, useActiveAccount } from "thirdweb/react";
import { arbitrum } from "thirdweb/chains";
import { getContract, createThirdwebClient } from "thirdweb";
import { ConnectButton } from "thirdweb/react";

const client = createThirdwebClient({
  clientId: "YOUR_CLIENT_ID",
});


const usdcContract = getContract({
  address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
  chain: arbitrum,
  client,
});

function App() {
const account = useActiveAccount();

if (!account) {
  return <ConnectButton client={client} />
}

return (
  <div>
    <p> Price: 50 USDC </p>
    <TransactionButton
      client={client}
      transaction={() => {
        if (!account) { throw new Error("No wallet connected"); }
        return transfer({
          contract: usdcContract,
          amount: "50",
          to: account.address,
        });
      }}
    >
      Buy VIP Pass
    </TransactionButton>


    <p> Price: 0.1 ETH </p>
    <TransactionButton
      client={client}
      transaction={() => {
        if (!account) { throw new Error("No wallet connected"); }
        return transfer({
          contract: usdcContract,
          amount: "50",
          to: account.address,
        });
      }}
    >
      Buy VIP Pass
    </TransactionButton>
  </div>
);
};`}
      header={{
        description: (
          <>
            Any transaction with value will automatically trigger onramp to fund
            the wallet if needed before executing the transaction.
          </>
        ),
        title: "Transaction Button",
      }}
      lang="tsx"
      preview={<PayTransactionButtonPreview />}
    />
  );
}
