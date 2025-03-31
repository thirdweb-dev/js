import ThirdwebProvider from "@/components/thirdweb-provider";
import { metadataBase } from "@/lib/constants";
import type { Metadata } from "next";
import {
  ConnectSmartAccountCustomPreview,
  ConnectSmartAccountPreview,
} from "../../../../components/account-abstraction/connect-smart-account";
import { APIHeader } from "../../../../components/blocks/APIHeader";
import { CodeExample } from "../../../../components/code/code-example";

export const metadata: Metadata = {
  metadataBase,
  title: "Sign In, Account Abstraction and SIWE Auth | thirdweb Connect",
  description:
    "Let users sign up with their email, phone number, social media accounts or directly with a wallet. Seamlessly integrate account abstraction and SIWE auth.",
};

export default function Page() {
  return (
    <ThirdwebProvider>
      <main className="container px-0 pb-20">
        <APIHeader
          title="Account Abstraction"
          description={
            <>
              Let users connect to their smart accounts with any wallet and
              unlock gas sponsorship, batched transactions, session keys and
              full wallet programmability.
            </>
          }
          docsLink="https://portal.thirdweb.com/connect/account-abstraction/overview?utm_source=playground"
          heroLink="/account-abstraction.png"
        />

        <section className="space-y-8">
          <ConnectSmartAccount />
        </section>
      </main>
    </ThirdwebProvider>
  );
}

function ConnectSmartAccount() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="font-semibold text-2xl tracking-tight sm:text-3xl">
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
  const adminWallet = inAppWallet();
  await adminWallet.connect({ client, strategy: "google" });
  return adminWallet;
})}>Connect with Google</button>
</>);
};`}
        lang="tsx"
      />
    </>
  );
}
