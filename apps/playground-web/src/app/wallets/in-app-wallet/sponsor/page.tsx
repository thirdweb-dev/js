import type { Metadata } from "next";
import { CodeExample } from "@/components/code/code-example";
import { PageLayout } from "../../../../components/blocks/APIHeader";
import { SponsoredInAppTxPreview } from "../../../../components/in-app-wallet/sponsored-tx";
import ThirdwebProvider from "../../../../components/thirdweb-provider";
import { metadataBase } from "../../../../lib/constants";

export const metadata: Metadata = {
  description:
    "With in-app wallets, users don't need to confirm every transaction. Combine it with smart account flag to cover gas costs for the best UX",
  metadataBase,
  title: "Signless Sponsored Transactions | thirdweb in-app wallet",
};

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        description={
          <>
            With in-app wallets, users {"don't"} need to confirm every
            transaction.
            <br />
            Combine it with smart account flag to cover gas costs for the best
            UX.
          </>
        }
        docsLink="https://portal.thirdweb.com/wallets/sponsor-gas?utm_source=playground"
        title="Signless Sponsored Transactions"
      >
        <SponsoredInAppTx />
      </PageLayout>
    </ThirdwebProvider>
  );
}

function SponsoredInAppTx() {
  return (
    <CodeExample
      code={`
import { inAppWallet } from "thirdweb/wallets";
import { claimTo } from "thirdweb/extensions/erc1155";
import {
  ConnectButton,
  TransactionButton,
} from "thirdweb/react";
import { baseSepolia } from "thirdweb/chains";

const wallets = [
  inAppWallet(
    {
      // turn on gas sponsorship for in-app wallets
      // Can use EIP4337 or EIP7702 on supported chains
      executionMode: {
        mode: "EIP4337",
        smartAccount: { chain: baseSepolia, sponsorGas: true },
      },
    }),
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
      preview={<SponsoredInAppTxPreview />}
    />
  );
}
