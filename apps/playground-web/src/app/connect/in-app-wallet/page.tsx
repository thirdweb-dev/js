import { CodeExample } from "@/components/code/code-example";
import { metadataBase } from "@/lib/constants";
import type { Metadata } from "next";
import { APIHeader } from "../../../components/blocks/APIHeader";
import { SponsoredInAppTxPreview } from "../../../components/in-app-wallet/sponsored-tx";
import { StyledConnectEmbed } from "../../../components/styled-connect-embed";

export const metadata: Metadata = {
  metadataBase,
  title: "Sign In, Account Abstraction and SIWE Auth | thirdweb Connect",
  description:
    "Let users sign up with their email, phone number, social media accounts or directly with a wallet. Seamlessly integrate account abstraction and SIWE auth.",
};

export default function Page() {
  return (
    <main className="pb-20 container px-0">
      <APIHeader
        title="Onboard users to web3"
        description={
          <>
            Onboard anyone with flexible auth options, secure account recovery,
            and smart account integration.
          </>
        }
        docsLink="https://portal.thirdweb.com/connect/in-app-wallet/overview"
        heroLink="/in-app-wallet.png"
      />

      <section className="space-y-8">
        <AnyAuth />
      </section>

      <div className="h-14" />

      <section className="space-y-8">
        <SponsoredInAppTx />
      </section>
    </main>
  );
}

function AnyAuth() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Any Auth Method
        </h2>
        <p className="max-w-[600px]">
          Use any of the built-in auth methods or bring your own.
          <br />
          Supports custom auth endpoints to integrate with your existing user
          base.
        </p>
      </div>

      <CodeExample
        preview={<StyledConnectEmbed />}
        code={`import { inAppWallet } from "thirdweb/wallets";
        import { ConnectEmbed } from "thirdweb/react";


        const wallets = [
          inAppWallet(
            // built-in auth methods
            { auth: {
              options: ["email", "phone", "passkey", "google", "apple", "facebook"]
              }
            }
            // or bring your own auth endpoint
          )
        ];

        function App(){
          return (
<ConnectEmbed client={client} wallets={wallets} />);
};`}
        lang="tsx"
      />
    </>
  );
}

function SponsoredInAppTx() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
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
