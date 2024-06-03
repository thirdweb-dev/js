import { CodeExample } from "@/components/code/code-example";
import { StyledConnectButton } from "@/components/styled-connect-button";
import { Button } from "@/components/ui/button";
import { metadataBase } from "@/lib/constants";
import type { Metadata } from "next";
import Link from "next/link";
import { chain } from "../../../components/account-abstraction/constants";
import { SponsoredTx } from "../../../components/account-abstraction/sponsored-tx";

export const metadata: Metadata = {
  metadataBase,
  title: "Sign In, Account Abstraction and SIWE Auth | thirdweb Connect",
  description:
    "Let users sign up with their email, phone number, social media accounts or directly with a wallet. Seemlessly integrate account abstraction and SIWE auth.",
};

export default function Page() {
  return (
    <main className="flex-1 content-center relative py-12 md:py-24 lg:py-32 xl:py-48 space-y-12 md:space-y-24 lg:space-y-32 xl:space-y-48">
      <section className="container px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4 min-h-[100%]">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-inter mb-6 text-balance">
                Account abstraction made easy
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-300 mb-6 font-inter">
                Let users connect to their smart accounts with any wallet and
                unlock gas sponsorship, batched transactions, session keys and
                full wallet programmability.
              </p>
            </div>
            <div className="flex flex-col gap-4 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link
                  target="_blank"
                  href="https://portal.thirdweb.com/connect/account-abstraction"
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
          <div className="w-full mx-auto my-auto sm:w-full lg:order-last relative flex flex-col space-y-2">
            <div className="mx-auto">
              <StyledConnectButton
                accountAbstraction={{
                  chain,
                  sponsorGas: true,
                }}
              />
            </div>

            <p className="md:text-xl text-center text-muted-foreground">
              <small>👆 Connect to your smart account 👆</small>
            </p>
          </div>
        </div>
      </section>

      <section className="container px-4 md:px-6 space-y-8">
        <div className="space-y-2">
          <h2 className="text-4xl font-semibold tracking-tight">
            Sponsored Transactions
          </h2>
          <p className="max-w-[600px]">
            One simple flag to enable transactions for your users.
            <br />
            Free on testnets, billed at the end of the month on mainnets.
          </p>
        </div>

        <CodeExample
          preview={<SponsoredTx />}
          code={`import { claimTo } from "thirdweb/extensions/erc1155";
          import { ConnectButton, TransactionButton } from "thirdweb/react";

          function App(){
            return (<>
{/* converts any wallet to a smart account */}
<ConnectButton client={client} accountAbstraction={{ chain, sponsorGas: true }} />

{/* all transactions will be sponsored */}
<TransactionButton transaction={() => claimTo({ contract, to: "0x123...", tokenId: 0n, quantity: 1n })}>Mint</TransactionButton>
</>);
};`}
          lang="tsx"
        />
      </section>
    </main>
  );
}
