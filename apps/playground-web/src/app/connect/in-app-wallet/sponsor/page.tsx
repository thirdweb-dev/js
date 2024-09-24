import { CodeExample } from "@/components/code/code-example";
import { SponsoredInAppTxPreview } from "../../../../components/in-app-wallet/sponsored-tx";
import ThirdwebProvider from "../../../../components/thirdweb-provider";

export default function Page() {
  return (
    <ThirdwebProvider>
      <section className="space-y-8">
        <SponsoredInAppTx />
      </section>
    </ThirdwebProvider>
  );
}

function SponsoredInAppTx() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="font-semibold text-2xl tracking-tight sm:text-3xl">
          Signless Sponsored Transactions
        </h2>
        <p className="max-w-[600px]">
          With in-app wallets, users don&apos;t need to confirm every
          transaction.
          <br />
          Combine it with smart account flag to cover gas costs for the best UX.
        </p>
      </div>
      <CodeExample
        preview={<SponsoredInAppTxPreview />}
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
    </>
  );
}
