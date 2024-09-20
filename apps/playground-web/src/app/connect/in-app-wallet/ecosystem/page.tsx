import { CodeExample } from "@/components/code/code-example";
import { EcosystemConnectEmbed } from "../../../../components/in-app-wallet/ecosystem";
import ThirdwebProvider from "../../../../components/thirdweb-provider";

export default function Page() {
  return (
    <ThirdwebProvider>
      <section className="space-y-8">
        <AnyAuth />
      </section>
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
