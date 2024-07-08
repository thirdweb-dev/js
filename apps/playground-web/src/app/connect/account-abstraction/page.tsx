import { Button } from "@/components/ui/button";
import { metadataBase } from "@/lib/constants";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ConnectSmartAccountCustomPreview,
  ConnectSmartAccountPreview,
} from "../../../components/account-abstraction/connect-smart-account";
import { PasskeySignerPreview } from "../../../components/account-abstraction/passkey";
import { SponsoredTxPreview } from "../../../components/account-abstraction/sponsored-tx";
import { CodeExample } from "../../../components/code/code-example";

export const metadata: Metadata = {
  metadataBase,
  title: "Sign In, Account Abstraction and SIWE Auth | thirdweb Connect",
  description:
    "Let users sign up with their email, phone number, social media accounts or directly with a wallet. Seamlessly integrate account abstraction and SIWE auth.",
};

export default function Page() {
  return (
    <main className="flex-1 content-center relative py-12 md:py-24 lg:py-32 xl:py-48 space-y-12 md:space-y-24">
      <section className="container px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4 min-h-[100%]">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-inter mb-6 text-balance">
                Account abstraction
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
                  href="https://portal.thirdweb.com/connect/account-abstraction/overview"
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
            <div className="max-w-full sm:max-w-[500px] p-8">
              <Image
                src={"/account-abstraction.png"}
                width={600}
                height={400}
                objectFit={"contain"}
                alt=""
                priority={true}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="container px-4 md:px-6 space-y-8">
        <PasskeySmartAccount />
      </section>

      <section className="container px-4 md:px-6 space-y-8">
        <ConnectSmartAccount />
      </section>

      <section className="container px-4 md:px-6 space-y-8">
        <SponsoredTx />
      </section>
    </main>
  );
}

function PasskeySmartAccount() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Passkey
        </h2>
        <p className="max-w-[600px]">Passkey signer</p>
      </div>
      <CodeExample
        preview={<PasskeySignerPreview />}
        code={`// Passkey

  function App(){
    return (<>
TODO: Add code here
</>)
};`}
        lang="tsx"
      />
    </>
  );
}

function ConnectSmartAccount() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Connect smart accounts
        </h2>
        <p className="max-w-[600px]">
          Enable smart accounts on the UI components or build your own UI.
        </p>
      </div>
      <CodeExample
        preview={<ConnectSmartAccountPreview />}
        code={`// Using UI components
  import { ConnectButton } from "thirdweb/react";

  function App(){
    return (<>
<ConnectButton client={client} 
// account abstraction options
accountAbstraction={{ chain, sponsorGas: true }} />
</>);
};`}
        lang="tsx"
      />
      <CodeExample
        preview={<ConnectSmartAccountCustomPreview />}
        code={`// Using your own UI
  import { useConnect } from "thirdweb/react";
  import { createWallet } from "thirdweb/wallets";

  function App(){
    const { connect } = useConnect({ client, 
      // account abstraction options
      accountAbstraction: { chain, sponsorGas: true }});

    return (<>
<button onClick={() => connect(async () => {
  // any wallet connected here will be
  // converted to a smart account
  const adminWallet = createWallet("io.metamask");
  await adminWallet.connect({ client });
  return adminWallet;
})}>Connect (metamask)</button>
</>);
};`}
        lang="tsx"
      />
    </>
  );
}

function SponsoredTx() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Sponsored transactions
        </h2>
        <p className="max-w-[600px]">
          Set `sponsorGas: true` to enable gas-free transactions for your users.
          <br />
          Free on testnets, billed at the end of the month on mainnets.
        </p>
      </div>
      <CodeExample
        preview={<SponsoredTxPreview />}
        code={`import { claimTo } from "thirdweb/extensions/erc1155";
  import { TransactionButton } from "thirdweb/react";

  function App(){
    return (<>
{/* transactions will be sponsored */}
<TransactionButton transaction={() => claimTo({ contract, to: "0x123...", tokenId: 0n, quantity: 1n })}>Mint</TransactionButton>
</>);
};`}
        lang="tsx"
      />
    </>
  );
}
