import { ShieldIcon } from "lucide-react";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { Eip7702SmartAccountPreview } from "../../../components/account-abstraction/7702-smart-account";
import { PageLayout } from "../../../components/blocks/APIHeader";
import { CodeExample } from "../../../components/code/code-example";
import { createMetadata } from "../../../lib/metadata";

const title = "Account Abstraction EIP-7702";
const description =
  "Enable account abstraction with EIP-7702. Unlock gasless transactions, session keys, paymaster support, and smart wallet programmability";
const ogDescription =
  "Use EIP-7702 to upgrade EOAs into temporary smart accounts. Bring native account abstraction to any wallet, enabling gasless transactions and advanced logic.";

export const metadata = createMetadata({
  description: ogDescription,
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
        description={description}
        docsLink="https://portal.thirdweb.com/wallets/sponsor-gas?utm_source=playground"
        title={title}
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
