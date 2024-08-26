import { metadataBase } from "@/lib/constants";
import type { Metadata } from "next";
import {
  ConnectSmartAccountCustomPreview,
  ConnectSmartAccountPreview,
} from "../../../components/account-abstraction/connect-smart-account";
import { SponsoredTxPreview } from "../../../components/account-abstraction/sponsored-tx";
import { APIHeader } from "../../../components/blocks/APIHeader";
import { CodeExample } from "../../../components/code/code-example";

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
        title="Account Abstraction"
        description={
          <>
            Let users connect to their smart accounts with any wallet and unlock
            gas sponsorship, batched transactions, session keys and full wallet
            programmability.
          </>
        }
        docsLink="https://portal.thirdweb.com/connect/account-abstraction/overview"
        heroLink="/account-abstraction.png"
      />

      <section className="space-y-8">
        <ConnectSmartAccount />
      </section>

      <div className="h-14" />

      <section className="space-y-8">
        <SponsoredTx />
      </section>
    </main>
  );
}

function ConnectSmartAccount() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Connect smart accounts
        </h2>
        <p className="max-w-[600px]">
          Enable smart accounts on the UI components or build your own UI.
        </p>
      </div>
      <CodeExample
        preview={<ConnectSmartAccountPreview />}
        code={`// Using UI components
  import { ConnectButton } from "thirdweb/react";

  function App(){
    return (<>
<ConnectButton client={client}
// account abstraction options
accountAbstraction={{ chain, sponsorGas: true }} />
</>);
};`}
        lang="tsx"
      />
      <CodeExample
        preview={<ConnectSmartAccountCustomPreview />}
        code={`// Using your own UI
  import { useConnect } from "thirdweb/react";
  import { createWallet } from "thirdweb/wallets";

  function App(){
    const { connect } = useConnect({ client,
      // account abstraction options
      accountAbstraction: { chain, sponsorGas: true }});

    return (<>
<button onClick={() => connect(async () => {
  // any wallet connected here will be
  // converted to a smart account
  const adminWallet = createWallet("io.metamask");
  await adminWallet.connect({ client });
  return adminWallet;
})}>Connect (metamask)</button>
</>);
};`}
        lang="tsx"
      />
    </>
  );
}

function SponsoredTx() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Sponsored transactions
        </h2>
        <p className="max-w-[600px]">
          Set `sponsorGas: true` to enable gas-free transactions for your users.
          <br />
          Free on testnets, billed at the end of the month on mainnets.
        </p>
      </div>
      <CodeExample
        preview={<SponsoredTxPreview />}
        code={`import { claimTo } from "thirdweb/extensions/erc1155";
  import { TransactionButton } from "thirdweb/react";

  function App(){
    return (<>
{/* transactions will be sponsored */}
<TransactionButton transaction={() => claimTo({ contract, to: "0x123...", tokenId: 0n, quantity: 1n })}>Mint</TransactionButton>
</>);
};`}
        lang="tsx"
      />
    </>
  );
}
