import { metadataBase } from "@/lib/constants";
import type { Metadata } from "next";
import { APIHeader } from "../../../components/blocks/APIHeader";
import { CodeExample } from "../../../components/code/code-example";
import { BuyMerchPreview } from "../../../components/pay/direct-payment";
import { StyledPayEmbedPreview } from "../../../components/pay/embed";
import { PayTransactionButtonPreview } from "../../../components/pay/transaction-button";

export const metadata: Metadata = {
  metadataBase,
  title: "Integrate Fiat & Cross-Chain Crypto Payments | thirdweb Pay",
  description:
    "The easiest way for users to transact in your app. Onramp users in clicks and generate revenue for each user transaction. Integrate for free.",
};

export default function Page() {
  return (
    <main className="pb-20 container px-0">
      <APIHeader
        title="The easiest way for users to transact in your app"
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

      <div className="h-14" />

      <section className="space-y-8">
        <BuyMerch />
      </section>

      <div className="h-14" />

      <section className="space-y-8">
        <BuyOnchainAsset />
      </section>
    </main>
  );
}

function StyledPayEmbed() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Top Up
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
            />
          );
        };`}
        lang="tsx"
      />
    </>
  );
}

function BuyMerch() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Commerce
        </h2>
        <p className="max-w-[600px]">
          Take paymets from Fiat or Crypto directly to your seller wallet.
          <br />
          Get notified for every sale through webhooks, which lets you trigger
          any action you want like shipping physical goods, activating services
          or doing onchain actions.
        </p>
      </div>

      <CodeExample
        preview={<BuyMerchPreview />}
        code={`import { PayEmbed, getDefaultToken } from "thirdweb/react";
          import { base } from "thirdweb/chains";

        function App() {
          return (
            <PayEmbed
              client={client}
              theme={"light"}
              payOptions={{
                mode: "direct_payment",
                paymentInfo: {
                  amount: "35",
                  chain: base,
                  token: getDefaultToken(base, "USDC"),
                  sellerAddress: "0xEb0effdFB4dC5b3d5d3aC6ce29F3ED213E95d675",
                },
                metadata: {
                  name: "Black Hoodie (Size L)",
                  image: "/drip-hoodie.png",
                },
              }}
            />
          );
        };`}
        lang="tsx"
      />
    </>
  );
}

function BuyOnchainAsset() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
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
        preview={<PayTransactionButtonPreview />}
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
