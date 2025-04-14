import ThirdwebProvider from "@/components/thirdweb-provider";
import { metadataBase } from "@/lib/constants";
import type { Metadata } from "next";
import { SponsoredTxZksyncPreview } from "../../../../components/account-abstraction/sponsored-tx-zksync";
import { PageLayout } from "../../../../components/blocks/APIHeader";
import { CodeExample } from "../../../../components/code/code-example";

export const metadata: Metadata = {
  metadataBase,
  title: "Native Account Abstraction",
  description:
    "On zkSync chains, you can take advantage of native account abstraction with no code changes",
};

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        title="Native Account Abstraction"
        description={
          <>
            On zkSync chains, you can take advantage of native account
            abstraction with no code changes.
          </>
        }
        docsLink="https://portal.thirdweb.com/connect/account-abstraction/overview?utm_source=playground"
      >
        <SponsoredZksyncTx />
      </PageLayout>
    </ThirdwebProvider>
  );
}

function SponsoredZksyncTx() {
  return (
    <>
      <CodeExample
        preview={<SponsoredTxZksyncPreview />}
        code={`\
import { claimTo } from "thirdweb/extensions/erc1155";
import { TransactionButton } from "thirdweb/react";

function App() {
  return (
    <>
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
      <TransactionButton
        transaction={() =>
          claimTo({
            contract,
            to: "0x123...",
            tokenId: 0n,
            quantity: 1n,
          })
        }
      >
        Mint
      </TransactionButton>
    </>
  );
}`}
        lang="tsx"
      />
    </>
  );
}
