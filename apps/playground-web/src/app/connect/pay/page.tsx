import { Button } from "@/components/ui/button";
import { metadataBase } from "@/lib/constants";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CodeExample } from "../../../components/code/code-example";
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
    <main className="flex-1 content-center relative py-12 md:py-24 lg:py-32 xl:py-48 space-y-12 md:space-y-24">
      <section className="container px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4 min-h-[100%]">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-inter mb-6 text-balance">
                The easiest way for users to transact in your app
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-300 mb-6 font-inter">
                Onramp users with credit card &amp; cross-chain crypto payments
                — and generate revenue for each user transaction.
              </p>
            </div>
            <div className="flex flex-col gap-4 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link
                  target="_blank"
                  href="https://portal.thirdweb.com/connect/pay/get-started"
                >
                  View docs
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link target="_blank" href="https://thirdweb.com/contact-us">
                  Book a Demo
                </Link>
              </Button>
            </div>
          </div>
          <div className="w-full mx-auto my-auto sm:w-full order-first lg:order-last relative flex flex-col space-y-2">
            <div className="max-w-full sm:max-w-[600px]">
              <Image
                width={600}
                height={400}
                src={"/pay.png"}
                objectFit={"contain"}
                alt=""
                priority={true}
              />
            </div>
          </div>
        </div>
      </section>
      <section className="container px-4 md:px-6 space-y-8">
        <StyledPayEmbed />
      </section>
      <section className="container px-4 md:px-6 space-y-8">
        <PayTransactionButton />
      </section>
    </main>
  );
}

function StyledPayEmbed() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Embed component
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

function PayTransactionButton() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Transaction Button
        </h2>
        <p className="max-w-[600px]">
          Transaction Button is a handy component that handles transactions.
          <br />
          If your user doesn&apos;t have enough funds for that transaction, a
          pre-filled pay modal will appear with the exact amount needed.
        </p>
      </div>

      <CodeExample
        preview={<PayTransactionButtonPreview />}
        code={`import { claimTo } from "thirdweb/extensions/erc1155";
        import { TransactionButton, useActiveAccount } from "thirdweb/react";


        function App() {
          const account = useActiveAccount();
        
          return (
            <TransactionButton
              transaction={() => {
                // any transaction works
                return claimTo({
                  contract,
                  quantity: 1n,
                  tokenId: 0n,
                  to: account.address,
                });
              }}
            >
              Buy for 10 MATIC
            </TransactionButton>
          );
        };`}
        lang="tsx"
      />
    </>
  );
}
