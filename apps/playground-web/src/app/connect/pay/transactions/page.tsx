import { PageLayout } from "@/components/blocks/APIHeader";
import { CodeExample } from "@/components/code/code-example";
import {
  PayTransactionButtonPreview,
  PayTransactionPreview,
} from "@/components/pay/transaction-button";
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
      <PageLayout
        title="Onchain transactions with fiat or crypto"
        description={
          <>
            Let your users pay for onchain transactions with fiat or crypto on
            any chain.
          </>
        }
        docsLink="https://portal.thirdweb.com/connect/pay/get-started?utm_source=playground"
        containerClassName="space-y-12"
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
      header={{
        title: "Transactions",
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
      }}
      preview={<PayTransactionPreview />}
      code={`import { claimTo } from "thirdweb/extensions/erc1155";
          import { PayEmbed, useActiveAccount } from "thirdweb/react";

        function App() {
          const account = useActiveAccount();
          const { data: nft } = useReadContract(getNFT, {
            contract: nftContract,
            tokenId: 0n,
          });

          return (
        <TransactionWidget
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
      lang="tsx"
    />
  );
}

function NoFundsPopup() {
  return (
    <CodeExample
      header={{
        title: "Automatic Onramp",
        description: (
          <>
            Any transaction with value will automatically trigger onramp to fund
            the wallet if needed before executing the transaction.
          </>
        ),
      }}
      preview={<PayTransactionButtonPreview />}
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
      lang="tsx"
    />
  );
}
