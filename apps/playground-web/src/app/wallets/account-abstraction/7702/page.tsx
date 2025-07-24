import type { Metadata } from "next";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { metadataBase } from "@/lib/constants";
import { Eip7702SmartAccountPreview } from "../../../../components/account-abstraction/7702-smart-account";
import { PageLayout } from "../../../../components/blocks/APIHeader";
import { CodeExample } from "../../../../components/code/code-example";

export const metadata: Metadata = {
  description:
    "EIP-7702 smart accounts allow you to turn your EOA into a smart account with no code changes",
  metadataBase,
  title: "EIP-7702 Smart Accounts | thirdweb Connect",
};

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        description={
          <>
            EIP-7702 smart accounts allow you to turn your EOA into a smart
            account with no code changes.
          </>
        }
        docsLink="https://portal.thirdweb.com/wallets/sponsor-gas?utm_source=playground"
        title="EIP-7702 Smart Accounts"
      >
        <Eip7702SmartAccount />
      </PageLayout>
    </ThirdwebProvider>
  );
}

function Eip7702SmartAccount() {
  return (
    <CodeExample
      code={`\
import { claimTo } from "thirdweb/extensions/erc1155";
import { TransactionButton } from "thirdweb/react";

const wallet = inAppWallet({
  executionMode: {
    mode: "EIP7702",
    sponsorGas: true,
  },
});

function App() {
  return (
    <>
      <ConnectButton
        client={client}
        wallet={[wallet]}
        connectButton={{
          label: "Login to mint!",
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
      header={{
        description:
          "In-app wallets can be turned into EIP-7702 smart accounts by changing the execution mode",
        title: "Turning in-app wallets into EIP-7702 smart accounts",
      }}
      lang="tsx"
      preview={<Eip7702SmartAccountPreview />}
    />
  );
}
