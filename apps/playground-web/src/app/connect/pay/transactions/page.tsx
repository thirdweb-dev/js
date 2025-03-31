import { APIHeader } from "@/components/blocks/APIHeader";
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
      <main className="container px-0 pb-20">
        <APIHeader
          title="Onchain transactions with fiat or crypto"
          description={
            <>
              Let your users pay for onchain transactions with fiat or crypto on
              any chain.
            </>
          }
          docsLink="https://portal.thirdweb.com/connect/pay/get-started?utm_source=playground"
          heroLink="/pay.png"
        />

        <section className="space-y-8">
          <BuyOnchainAsset />
        </section>

        <div className="h-14" />

        <section className="space-y-8">
          <NoFundsPopup />
        </section>
      </main>
    </ThirdwebProvider>
  );
}

function BuyOnchainAsset() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="font-semibold text-2xl tracking-tight sm:text-3xl">
          Transactions
        </h2>
        <p className="max-w-[600px]">
          Let your users pay for onchain transactions with fiat or crypto on any
          chain.
          <br />
          Amounts are calculated automatically from the transaction, and will
          get executed after the user has obtained the necessary funds via
          onramp or swap.
        </p>
      </div>

      <CodeExample
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
            <PayEmbed
              client={client}
              payOptions={{
                mode: "transaction",
                transaction: claimTo({
                  contract: nftContract,
                  quantity: 1n,
                  tokenId: 0n,
                  to: account?.address,
                }),
                metadata: nft?.metadata,
              }}
            />
          );
        };`}
        lang="tsx"
      />
    </>
  );
}

function NoFundsPopup() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="font-semibold text-2xl tracking-tight sm:text-3xl">
          Automatic Onramp
        </h2>
        <p className="max-w-[600px]">
          Any transaction with value will automatically trigger onramp to fund
          the wallet if needed before executing the transaction.
        </p>
      </div>

      <CodeExample
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
    </>
  );
}
