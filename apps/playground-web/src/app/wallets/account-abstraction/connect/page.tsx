import type { Metadata } from "next";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { metadataBase } from "@/lib/constants";
import {
  ConnectSmartAccountCustomPreview,
  ConnectSmartAccountPreview,
} from "../../../../components/account-abstraction/connect-smart-account";
import { PageLayout } from "../../../../components/blocks/APIHeader";
import { CodeExample } from "../../../../components/code/code-example";

export const metadata: Metadata = {
  description:
    "Let users sign up with their email, phone number, social media accounts or directly with a wallet. Seamlessly integrate account abstraction and SIWE auth.",
  metadataBase,
  title: "Account Abstraction | thirdweb Connect",
};

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        description={
          <>
            Let users connect to their smart accounts with any wallet and unlock
            gas sponsorship, batched transactions, session keys and full wallet
            programmability.
          </>
        }
        docsLink="https://portal.thirdweb.com/wallets/sponsor-gas?utm_source=playground"
        title="Connect smart accounts"
      >
        <ConnectSmartAccount />
      </PageLayout>
    </ThirdwebProvider>
  );
}

function ConnectSmartAccount() {
  return (
    <>
      <CodeExample
        code={`\
  import { ConnectButton } from "thirdweb/react";

  function App(){
    return (<>
<ConnectButton client={client}
// account abstraction options
accountAbstraction={{ chain, sponsorGas: true }} />
</>);
};`}
        header={{
          description:
            "Use the prebuilt UI components to connect to smart accounts",
          title: "Using prebuilt UI component",
        }}
        lang="tsx"
        preview={<ConnectSmartAccountPreview />}
      />

      <div className="h-14" />
      <CodeExample
        code={`\
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
        header={{
          description: "Build your own UI to connect to smart accounts",
          title: "Build custom UI",
        }}
        lang="tsx"
        preview={<ConnectSmartAccountCustomPreview />}
      />
    </>
  );
}
