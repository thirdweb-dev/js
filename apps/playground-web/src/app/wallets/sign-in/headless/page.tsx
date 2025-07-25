import type { Metadata } from "next";
import { PageLayout } from "@/components/blocks/APIHeader";
import { CodeExample } from "@/components/code/code-example";
import { HooksPreview } from "@/components/sign-in/hooks";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { metadataBase } from "@/lib/constants";
import { ModalPreview } from "../../../../components/sign-in/modal";

export const metadata: Metadata = {
  description:
    "Let users sign up with their email, phone number, social media accounts or directly with a wallet. Seamlessly integrate account abstraction and SIWE auth.",
  metadataBase,
  title: "Sign In, Account Abstraction and SIWE Auth | thirdweb Connect",
};

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        description={
          <>
            Create a login experience tailor-made for your app. Add your wallets
            of choice, enable web2 sign-in options and create a modal that fits
            your brand.
          </>
        }
        docsLink="https://portal.thirdweb.com/wallets?utm_source=playground"
        title="Headless"
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
    <CodeExample
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
      header={{
        title: "Open prebuilt connect modal using a hook",
      }}
      lang="tsx"
      preview={<ModalPreview />}
    />
  );
}

function BuildCustomUISection() {
  return (
    <CodeExample
      code={`\
import { useConnect } from "thirdweb/react";
import { createWallet, injectedProvider } from "thirdweb/wallets";
import { shortenAddress } from "thirdweb/utils";

function App() {
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const { connect, isConnecting, error, cancelConnection } = useConnect();
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
          const isInstalled = !!injectedProvider("io.metamask");
          await wallet.connect({ client, ...(isInstalled ? {} : {
            walletConnect: {
              // if not installed, show qr modal
              showQrModal: true,
              onCancel: () => {
                cancelConnection();
              }
              }
            })
          });
          return wallet;
        })
      }
    >
      Connect MetaMask
    </button>
  );
}`}
      header={{
        description:
          "Full control over your UI using react hooks. Wallet state management is all handled for you.",
        title: "Create custom UI using hooks",
      }}
      lang="tsx"
      preview={<HooksPreview />}
    />
  );
}
