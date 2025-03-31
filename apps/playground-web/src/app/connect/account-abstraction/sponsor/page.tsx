import ThirdwebProvider from "@/components/thirdweb-provider";
import { metadataBase } from "@/lib/constants";
import type { Metadata } from "next";
import { SponsoredTxPreview } from "../../../../components/account-abstraction/sponsored-tx";
import { APIHeader } from "../../../../components/blocks/APIHeader";
import { CodeExample } from "../../../../components/code/code-example";

export const metadata: Metadata = {
  metadataBase,
  title: "Sign In, Account Abstraction and SIWE Auth | thirdweb Connect",
  description:
    "Let users sign up with their email, phone number, social media accounts or directly with a wallet. Seamlessly integrate account abstraction and SIWE auth.",
};

export default function Page() {
  return (
    <ThirdwebProvider>
      <main className="container px-0 pb-20">
        <APIHeader
          title="Account Abstraction"
          description={
            <>
              Let users connect to their smart accounts with any wallet and
              unlock gas sponsorship, batched transactions, session keys and
              full wallet programmability.
            </>
          }
          docsLink="https://portal.thirdweb.com/connect/account-abstraction/overview?utm_source=playground"
          heroLink="/account-abstraction.png"
        />

        <section className="space-y-8">
          <SponsoredTx />
        </section>
      </main>
    </ThirdwebProvider>
  );
}

function SponsoredTx() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="font-semibold text-2xl tracking-tight sm:text-3xl">
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
<ConnectButton
              client={client}
              accountAbstraction={{
                chain,
                sponsorGas: true, // sponsor gas for all transactions
              }}
              connectButton={{
                label: "Login to mint this Kitten!",
              }}
            />
{/* since sponsorGas is true, transactions will be sponsored */}
<TransactionButton transaction={() => claimTo({ contract, to: "0x123...", tokenId: 0n, quantity: 1n })}>Mint</TransactionButton>
</>);
};`}
        lang="tsx"
      />
    </>
  );
}
