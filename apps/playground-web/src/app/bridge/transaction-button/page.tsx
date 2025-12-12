import { ArrowLeftRightIcon } from "lucide-react";
import { PageLayout } from "@/components/blocks/APIHeader";
import { CodeExample } from "@/components/code/code-example";
import { PayTransactionButtonPreview } from "@/components/pay/transaction-button";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { createMetadata } from "@/lib/metadata";

const title = "Transaction Button";
const description =
  "Transaction Button component allows users to perform onchain transaction and prompts the user to fund the wallet if required from fiat or swap";

export const metadata = createMetadata({
  description: description,
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
        docsLink="https://portal.thirdweb.com/references/typescript/v5/TransactionButton?utm_source=playground"
        title={title}
      >
        <Example />
      </PageLayout>
    </ThirdwebProvider>
  );
}

function Example() {
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
      lang="tsx"
      preview={<PayTransactionButtonPreview />}
    />
  );
}
