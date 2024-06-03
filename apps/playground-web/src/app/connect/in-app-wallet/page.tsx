import { CodeExample } from "@/components/code/code-example";
import { StyledConnectButton } from "@/components/styled-connect-button";
import { Button } from "@/components/ui/button";
import { metadataBase } from "@/lib/constants";
import type { Metadata } from "next";
import Link from "next/link";
import { inAppWallet } from "thirdweb/wallets/in-app";
import { SponsoredTx } from "../../../components/account-abstraction/sponsored-tx";
import { AnyAuth } from "../../../components/in-app-wallet/any-auth";
import { InAppConnectButton } from "../../../components/in-app-wallet/connect-button";
import { SponsoredInAppTx } from "../../../components/in-app-wallet/sponsored-tx";

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
                Onboard users to web3
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-300 mb-6 font-inter">
                Onboard anyone with flexible auth options, secure account
                recovery, and smart account integration.
              </p>
            </div>
            <div className="flex flex-col gap-4 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link
                  target="_blank"
                  href="https://portal.thirdweb.com/connect/in-app-wallet/overview"
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
              <InAppConnectButton />
            </div>

            <p className="md:text-xl text-center text-muted-foreground">
              <small>👆 Connect to your in-app wallet 👆</small>
            </p>
          </div>
        </div>
      </section>

      <section className="container px-4 md:px-6 space-y-8">
        <div className="space-y-2">
          <h2 className="text-4xl font-semibold tracking-tight">
            Any Auth Method
          </h2>
          <p className="max-w-[600px]">
            Use any of the built-in auth methods or bring your own.
            <br />
            Supports custom auth endpoints to integrate with your existing user
            base.
          </p>
        </div>

        <CodeExample
          preview={<AnyAuth />}
          code={`import { inAppWallet } from "thirdweb/wallets";
          import { ConnectEmbed } from "thirdweb/react";

          
          const wallets = [
            inAppWallet(
              // built-in auth methods
              { auth: ["email", "phone", "passkey", "google", "apple", "facebook"] }
              // or bring your own auth endpoint
            )
          ];

          function App(){
            return (
<ConnectEmbed client={client} wallets={wallets} />);
};`}
          lang="tsx"
        />
      </section>

      <section className="container px-4 md:px-6 space-y-8">
        <div className="space-y-2">
          <h2 className="text-4xl font-semibold tracking-tight">
            Signless Sponsored Transactions
          </h2>
          <p className="max-w-[600px]">
            With in-app wallets, users don&apos;t need to confirm every
            transaction.
            <br />
            Combine it with smart account flag to cover gas costs for the best
            UX.
          </p>
        </div>

        <CodeExample
          preview={<SponsoredInAppTx />}
          code={`import { inAppWallet } from "thirdweb/wallets";
          import { claimTo } from "thirdweb/extensions/erc1155";
          import { ConnectButton, TransactionButton } from "thirdweb/react";

          
          const wallets = [
            inAppWallet(
              // turn on gas sponsorship for in-app wallets
              { smartAccount: { chain, sponsorGas: true }}
            )
          ];

          function App(){
            return (<>
<ConnectButton client={client} wallets={wallets} />

{/* signless, sponsored transactions */}
<TransactionButton transaction={() => claimTo({ contract, to: "0x123...", tokenId: 0n, quantity: 1n })}>Mint</TransactionButton>
</>);
};`}
          lang="tsx"
        />
      </section>
    </main>
  );
}
