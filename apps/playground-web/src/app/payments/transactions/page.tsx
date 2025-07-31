import { ArrowLeftRightIcon } from "lucide-react";
import { PageLayout } from "@/components/blocks/APIHeader";
import { CodeExample } from "@/components/code/code-example";
import {
  PayTransactionButtonPreview,
  PayTransactionPreview,
} from "@/components/pay/transaction-button";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { createMetadata } from "@/lib/metadata";

const title = "Onchain Transaction Component";
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
        <BuyOnchainAsset />
        <NoFundsPopup />
      </PageLayout>
    </ThirdwebProvider>
  );
}

function BuyOnchainAsset() {
  return (
    <CodeExample
      code={`import { claimTo } from "thirdweb/extensions/erc1155";
          import { TransactionWidget, useActiveAccount } from "thirdweb/react";

        function App() {
          const account = useActiveAccount();
          const { data: nft } = useReadContract(getNFT, {
            contract: nftContract,
            tokenId: 0n,
          });

          return (
        <TransactionWidget
          amount={"0.001"}
          client={THIRDWEB_CLIENT}
          theme={theme === "light" ? "light" : "dark"}
          transaction={claimTo({
            contract: nftContract,
            quantity: 1n,
            tokenId: 2n,
            to: account?.address || "",
          })}
          title={nft?.metadata?.name}
          description={nft?.metadata?.description}
          image={nft?.metadata?.image}
        />
          );
        };`}
      header={{
        description: (
          <>
            Let your users pay for onchain transactions with fiat or crypto on
            any chain.
            <br />
            Amounts are calculated automatically from the transaction, and will
            get executed after the user has obtained the necessary funds via
            onramp or swap.
          </>
        ),
        title: "Transactions",
      }}
      lang="tsx"
      preview={<PayTransactionPreview />}
    />
  );
}

function NoFundsPopup() {
  return (
    <CodeExample
      code={`import { transfer } from "thirdweb/extensions/erc1155";
          import { TransactionButton, useActiveAccount } from "thirdweb/react";


        function App() {
          const account = useActiveAccount();

          return (
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
          );
        };`}
      header={{
        description: (
          <>
            Any transaction with value will automatically trigger onramp to fund
            the wallet if needed before executing the transaction.
          </>
        ),
        title: "Automatic Onramp",
      }}
      lang="tsx"
      preview={<PayTransactionButtonPreview />}
    />
  );
}
