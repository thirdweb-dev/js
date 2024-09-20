import { CodeExample } from "@/components/code/code-example";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { metadataBase } from "@/lib/constants";
import type { Metadata } from "next";
import { APIHeader } from "../../../../components/blocks/APIHeader";
import { EcosystemConnectEmbed } from "../../../../components/in-app-wallet/ecosystem";

export const metadata: Metadata = {
  metadataBase,
  title: "Sign In, Account Abstraction and SIWE Auth | thirdweb Connect",
  description:
    "Let users sign up with their email, phone number, social media accounts or directly with a wallet. Seamlessly integrate account abstraction and SIWE auth.",
};

export default function Page() {
  return (
    <ThirdwebProvider>
      <main className="pb-20 container px-0">
        <APIHeader
          title="Onboard users to web3"
          description={
            <>
              Onboard anyone with flexible auth options, secure account
              recovery, and smart account integration.
            </>
          }
          docsLink="https://portal.thirdweb.com/connect/in-app-wallet/overview"
          heroLink="/in-app-wallet.png"
        />

        <section className="space-y-8">
          <AnyAuth />
        </section>
      </main>
    </ThirdwebProvider>
  );
}

function AnyAuth() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Your own Ecosystem
        </h2>
        <p className="max-w-[600px]">
          Build a public or permissioned ecosystem by allowing third party apps
          and games to connect to the same accounts.
        </p>
      </div>

      <CodeExample
        preview={<EcosystemConnectEmbed />}
        code={`import { ecosystemWallet } from "thirdweb/wallets";
        import { ConnectEmbed } from "thirdweb/react";


        const wallets = [
          // all settings are controlled in your dashboard
          // including permissions, auth options, etc.
          ecosystemWallet("ecosystem.your-ecosystem-name")
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
