import { PageLayout } from "@/components/blocks/APIHeader";
import { CodeExample } from "@/components/code/code-example";
import { HooksPreview } from "@/components/sign-in/hooks";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { metadataBase } from "@/lib/constants";
import type { Metadata } from "next";
import { ModalPreview } from "../../../../components/sign-in/modal";

export const metadata: Metadata = {
  metadataBase,
  title: "Sign In, Account Abstraction and SIWE Auth | thirdweb Connect",
  description:
    "Let users sign up with their email, phone number, social media accounts or directly with a wallet. Seamlessly integrate account abstraction and SIWE auth.",
};

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        title="Headless"
        description={
          <>
            Create a login experience tailor-made for your app. Add your wallets
            of choice, enable web2 sign-in options and create a modal that fits
            your brand.
          </>
        }
        docsLink="https://portal.thirdweb.com/connect/sign-in/overview?utm_source=playground"
      >
        <div className="flex flex-col gap-14">
          <BuildCustomUISection />
          <OpenConnectModalSection />
        </div>
      </PageLayout>
    </ThirdwebProvider>
  );
}

function OpenConnectModalSection() {
  return (
    <>
      <CodeExample
        header={{
          title: "Open prebuilt connect modal using a hook",
        }}
        preview={<ModalPreview />}
        code={`\
import { useConnectModal } from "thirdweb/react";

function App() {
  const { connect, isConnecting } = useConnectModal();

  return (
    <button
      onClick={async () => {
        // pass modal configuration options to the connect function
        const wallet = await connect({ client });
        console.log("connected", wallet);
      }}
    >
      Sign in
    </button>
  );
}`}
        lang="tsx"
      />
    </>
  );
}

function BuildCustomUISection() {
  return (
    <CodeExample
      lang="tsx"
      header={{
        title: "Create custom UI using hooks",
        description:
          "Full control over your UI using react hooks. Wallet state management is all handled for you.",
      }}
      preview={<HooksPreview />}
      code={`\
import { useConnect } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { shortenAddress } from "thirdweb/utils";

function App() {
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const { connect, isConnecting, error } = useConnect();
  const { disconnect } = useDisconnect();

  if (account) {
    return (
      <div>
        <p>Connected: {shortenAddress(account.address)} </p>
        {wallet && (
          <button onClick={() => disconnect(wallet)}>
            Disconnect
          </button>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() =>
        connect(async () => {
          // 500+ wallets supported with id autocomplete
          const wallet = createWallet("io.metamask");
          await wallet.connect({ client });
          return wallet;
        })
      }
    >
      Connect MetaMask
    </button>
  );
}`}
    />
  );
}
