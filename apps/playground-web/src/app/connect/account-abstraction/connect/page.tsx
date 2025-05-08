import ThirdwebProvider from "@/components/thirdweb-provider";
import { metadataBase } from "@/lib/constants";
import type { Metadata } from "next";
import {
  ConnectSmartAccountCustomPreview,
  ConnectSmartAccountPreview,
} from "../../../../components/account-abstraction/connect-smart-account";
import { PageLayout } from "../../../../components/blocks/APIHeader";
import { CodeExample } from "../../../../components/code/code-example";

export const metadata: Metadata = {
  metadataBase,
  title: "Account Abstraction | thirdweb Connect",
  description:
    "Let users sign up with their email, phone number, social media accounts or directly with a wallet. Seamlessly integrate account abstraction and SIWE auth.",
};

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        title="Connect smart accounts"
        description={
          <>
            Let users connect to their smart accounts with any wallet and unlock
            gas sponsorship, batched transactions, session keys and full wallet
            programmability.
          </>
        }
        docsLink="https://portal.thirdweb.com/connect/account-abstraction/overview?utm_source=playground"
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
        header={{
          title: "Using prebuilt UI component",
          description:
            "Use the prebuilt UI components to connect to smart accounts",
        }}
        preview={<ConnectSmartAccountPreview />}
        code={`\
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

      <div className="h-14" />
      <CodeExample
        header={{
          title: "Build custom UI",
          description: "Build your own UI to connect to smart accounts",
        }}
        preview={<ConnectSmartAccountCustomPreview />}
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
        lang="tsx"
      />
    </>
  );
}
