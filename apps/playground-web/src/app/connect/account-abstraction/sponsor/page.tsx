import ThirdwebProvider from "@/components/thirdweb-provider";
import { metadataBase } from "@/lib/constants";
import type { Metadata } from "next";
import { SponsoredTxPreview } from "../../../../components/account-abstraction/sponsored-tx";
import { PageLayout } from "../../../../components/blocks/APIHeader";
import { CodeExample } from "../../../../components/code/code-example";

export const metadata: Metadata = {
  metadataBase,
  title: "Sponsored transactions | thirdweb Connect",
  description:
    "Easily enable gas-free transactions for your users, Free on testnets, billed at the end of the month on mainnets.",
};

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        title="Sponsored transactions"
        description={
          <>
            Easily enable gas-free transactions for your users, Free on
            testnets, billed at the end of the month on mainnets.
          </>
        }
        docsLink="https://portal.thirdweb.com/connect/account-abstraction/overview?utm_source=playground"
      >
        <SponsoredTx />
      </PageLayout>
    </ThirdwebProvider>
  );
}

function SponsoredTx() {
  return (
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
  );
}
