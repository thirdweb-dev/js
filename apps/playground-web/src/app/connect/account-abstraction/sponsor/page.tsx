import ThirdwebProvider from "@/components/thirdweb-provider";
import { metadataBase } from "@/lib/constants";
import type { Metadata } from "next";
import { SponsoredTxPreview } from "../../../../components/account-abstraction/sponsored-tx";
import { PageLayout } from "../../../../components/blocks/APIHeader";
import { CodeExample } from "../../../../components/code/code-example";

export const metadata: Metadata = {
  metadataBase,
  title: "EIP-4337 Smart Contract Wallets | thirdweb Connect",
  description: "Turn any EOA into a smart contract wallet with EIP-4337.",
};

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        title="EIP-4337 Smart Contract Wallets"
        description={
          <>Turn any EOA into a smart contract wallet with EIP-4337.</>
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
