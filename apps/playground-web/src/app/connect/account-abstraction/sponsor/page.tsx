import ThirdwebProvider from "@/components/thirdweb-provider";
import { metadataBase } from "@/lib/constants";
import type { Metadata } from "next";
import { ConnectSmartAccountCustomPreview } from "../../../../components/account-abstraction/connect-smart-account";
import { SponsoredTxPreview } from "../../../../components/account-abstraction/sponsored-tx";
import { PageLayout } from "../../../../components/blocks/APIHeader";
import { CodeExample } from "../../../../components/code/code-example";
import { SponsoredInAppTxPreview } from "../../../../components/in-app-wallet/sponsored-tx";

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
        <div className="flex flex-col gap-14">
          <SponsoredTx />
          <SponsoredInAppTx />
          <ConnectSmartAccount />
        </div>
      </PageLayout>
    </ThirdwebProvider>
  );
}

function SponsoredTx() {
  return (
    <CodeExample
      header={{
        title: "Usage with any external wallet",
        description:
          "Use the accountAbstraction flag on the ConnectButton or useConnect hook to automatically convert any external wallet to a EIP-4337 smart contract wallet.",
      }}
      preview={<SponsoredTxPreview />}
      code={`\
  import { useConnect } from "thirdweb/react";
  import { inAppWallet } from "thirdweb/wallets";

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

function SponsoredInAppTx() {
  return (
    <CodeExample
      header={{
        title: "Usage with in-app wallets",
        description:
          "Set the executionMode when creating your in-app wallet to turn it into a EIP-4337 smart contract wallet. Note that when set, the returned address will be the smart contract wallet address.",
      }}
      preview={<SponsoredInAppTxPreview />}
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
    />
  );
}

function ConnectSmartAccount() {
  return (
    <CodeExample
      header={{
        title: "Build custom UI",
        description: "Build your own UI to connect to 4337 smart accounts",
      }}
      preview={<ConnectSmartAccountCustomPreview />}
      code={`\
  import { useConnect } from "thirdweb/react";
  import { inAppWallet } from "thirdweb/wallets";

  const wallet = inAppWallet({
    executionMode: {
      mode: "EIP4337",
      smartAccount: { chain: baseSepolia, sponsorGas: true },
    },
  });

  function App(){
    const { connect } = useConnect();

    return (<>
<button onClick={() => connect(async () => {
  await wallet.connect({ client, strategy: "google" });
  return adminWallet;
})}>Connect with Google</button>
</>);
};`}
      lang="tsx"
    />
  );
}
