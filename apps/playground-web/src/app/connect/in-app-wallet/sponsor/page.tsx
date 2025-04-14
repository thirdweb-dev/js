import { CodeExample } from "@/components/code/code-example";
import type { Metadata } from "next";
import { PageLayout } from "../../../../components/blocks/APIHeader";
import { SponsoredInAppTxPreview } from "../../../../components/in-app-wallet/sponsored-tx";
import ThirdwebProvider from "../../../../components/thirdweb-provider";
import { metadataBase } from "../../../../lib/constants";

export const metadata: Metadata = {
  metadataBase,
  title: "Signless Sponsored Transactions | thirdweb in-app wallet",
  description:
    "With in-app wallets, users don't need to confirm every transaction. Combine it with smart account flag to cover gas costs for the best UX",
};

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        title="Signless Sponsored Transactions"
        description={
          <>
            With in-app wallets, users {"don't"} need to confirm every
            transaction.
            <br />
            Combine it with smart account flag to cover gas costs for the best
            UX.
          </>
        }
        docsLink="https://portal.thirdweb.com/connect/in-app-wallet/overview?utm_source=playground"
      >
        <SponsoredInAppTx />
      </PageLayout>
    </ThirdwebProvider>
  );
}

function SponsoredInAppTx() {
  return (
    <CodeExample
      preview={<SponsoredInAppTxPreview />}
      code={`
import { inAppWallet } from "thirdweb/wallets";
import { claimTo } from "thirdweb/extensions/erc1155";
import {
  ConnectButton,
  TransactionButton,
} from "thirdweb/react";

const wallets = [
  inAppWallet(
    // turn on gas sponsorship for in-app wallets
    { smartAccount: { chain, sponsorGas: true } },
  ),
];

function App() {
  return (
    <>
      <ConnectButton client={client} wallets={wallets} />

      {/* signless, sponsored transactions */}
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
  );
}
