import { APIHeader } from "@/components/blocks/APIHeader";
import { CodeExample } from "@/components/code/code-example";
import { HooksPreview } from "@/components/sign-in/hooks";
import { metadataBase } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase,
  title: "Sign In, Account Abstraction and SIWE Auth | thirdweb Connect",
  description:
    "Let users sign up with their email, phone number, social media accounts or directly with a wallet. Seemlessly integrate account abstraction and SIWE auth.",
};

export default function Page() {
  return (
    <main className="pb-20 container px-0">
      <APIHeader
        title="Sign in"
        description={
          <>
            Create a login experience tailor-made for your app. Add your wallets
            of choice, enable web2 sign-in options and create a modal that fits
            your brand.
          </>
        }
        docsLink="https://portal.thirdweb.com/connect/sign-in/overview"
        heroLink="/connectors.png"
      />

      <Hooks />
    </main>
  );
}

function Hooks() {
  return (
    <>
      <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-2">
        Create custom UI using hooks
      </h2>

      <p className="max-w-[600px] mb-5">
        Build your own connect UI using react hooks.
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

          return (<>
      <button onClick={() => connect(async () => {
        // 350+ wallets supported with id autocomplete
        const wallet = createWallet("io.metamask");
        await wallet.connect({ client });
        return wallet;
      })}>Connect with Metamask</button>
      </>);
      };`}
        lang="tsx"
      />
    </>
  );
}
