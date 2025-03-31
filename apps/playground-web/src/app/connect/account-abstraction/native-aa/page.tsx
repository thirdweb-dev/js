import ThirdwebProvider from "@/components/thirdweb-provider";
import { metadataBase } from "@/lib/constants";
import type { Metadata } from "next";
import { SponsoredTxZksyncPreview } from "../../../../components/account-abstraction/sponsored-tx-zksync";
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
          <SponsoredZksyncTx />
        </section>
      </main>
    </ThirdwebProvider>
  );
}

function SponsoredZksyncTx() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="font-semibold text-2xl tracking-tight sm:text-3xl">
          Native Account Abstraction
        </h2>
        <p className="max-w-[600px]">
          On zkSync chains, you can take advantage of native account abstraction
          no code changes. The `sponsorGas` option also works out of the box.
        </p>
      </div>
      <CodeExample
        preview={<SponsoredTxZksyncPreview />}
        code={`import { claimTo } from "thirdweb/extensions/erc1155";
  import { TransactionButton } from "thirdweb/react";

  function App(){
    return (<>
    <ConnectButton
              client={client}
              accountAbstraction={{
                chain: zkSyncSepolia, // zkSync chain with native AA
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
