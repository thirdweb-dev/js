import { APIHeader } from "@/components/blocks/APIHeader";
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
    "Let users sign up with their email, phone number, social media accounts or directly with a wallet. Seemlessly integrate account abstraction and SIWE auth.",
};

export default function Page() {
  return (
    <ThirdwebProvider>
      <main className="container px-0 pb-20">
        <APIHeader
          title="Sign in"
          description={
            <>
              Create a login experience tailor-made for your app. Add your
              wallets of choice, enable web2 sign-in options and create a modal
              that fits your brand.
            </>
          }
          docsLink="https://portal.thirdweb.com/connect/sign-in/overview"
          heroLink="/connectors.png"
        />
        <Modal />
        <div className="h-6" />
        <Hooks />
      </main>
    </ThirdwebProvider>
  );
}

function Modal() {
  return (
    <>
      <h2 className="mb-2 font-semibold text-2xl tracking-tight sm:text-3xl">
        Open the connect modal from anywhere
      </h2>

      <p className="mb-5 max-w-[600px]">
        You can open the connect modal from anywhere in your app.
      </p>

      <CodeExample
        preview={<ModalPreview />}
        code={`// Using your own UI
        import { useConnectModal } from "thirdweb/react";

        function App(){
          const { connect } = useConnectModal();

          return (
          // pass modal configuration options here
      <button onClick={() => connect({ client })}>Sign in</button>
      );
      };`}
        lang="tsx"
      />
    </>
  );
}

function Hooks() {
  return (
    <>
      <h2 className="mb-2 font-semibold text-2xl tracking-tight sm:text-3xl">
        Create custom UI using hooks
      </h2>

      <p className="mb-5 max-w-[600px]">
        Full control over your UI using react hooks.
        <br />
        Wallet state management is all handled for you.
      </p>

      <CodeExample
        preview={<HooksPreview />}
        code={`// Using your own UI
        import { useConnect } from "thirdweb/react";
        import { createWallet } from "thirdweb/wallets";

        function App(){
          const { connect } = useConnect();

          return (
      <button onClick={() => connect(async () => {
        // 500+ wallets supported with id autocomplete
        const wallet = createWallet("io.metamask");
        await wallet.connect({ client });
        return wallet;
      })}>Connect with Metamask</button>
      );
      };`}
        lang="tsx"
      />
    </>
  );
}
