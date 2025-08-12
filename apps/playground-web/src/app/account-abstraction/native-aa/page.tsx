import { ShieldIcon } from "lucide-react";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { createMetadata } from "@/lib/metadata";
import { SponsoredTxZksyncPreview } from "../../../components/account-abstraction/sponsored-tx-zksync";
import { PageLayout } from "../../../components/blocks/APIHeader";
import { CodeExample } from "../../../components/code/code-example";

const title = "Native Account Abstraction Through zkSync";
const description =
  "Leverage native account abstraction on zkSync. Use smart accounts out of the box for gasless transactions, batching, and flexible signing logic";

export const metadata = createMetadata({
  description,
  title,
  image: {
    icon: "wallets",
    title,
  },
});

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        icon={ShieldIcon}
        title={title}
        description={description}
        docsLink="https://portal.thirdweb.com/wallets/sponsor-gas?utm_source=playground"
      >
        <SponsoredZksyncTx />
      </PageLayout>
    </ThirdwebProvider>
  );
}

function SponsoredZksyncTx() {
  return (
    <CodeExample
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
      preview={<SponsoredTxZksyncPreview />}
    />
  );
}
