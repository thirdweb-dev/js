export const dynamic = "force-dynamic";
import { CodeExample } from "@/components/code/code-example";
import { InAppConnectEmbed } from "../../../components/in-app-wallet/connect-button";
import { Profiles } from "../../../components/in-app-wallet/profile-sections";
import ThirdwebProvider from "../../../components/thirdweb-provider";

export default function Page() {
  return (
    <ThirdwebProvider>
      <section className="space-y-8">
        <AnyAuth />
      </section>
      <section className="mt-8 space-y-8">
        <Profiles />
      </section>
    </ThirdwebProvider>
  );
}

function AnyAuth() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="font-semibold text-2xl tracking-tight sm:text-3xl">
          Any Auth Method
        </h2>
        <p className="max-w-[600px]">
          Use any of the built-in auth methods or bring your own.
          <br />
          Supports custom auth endpoints to integrate with your existing user
          base.
        </p>
      </div>

      <CodeExample
        preview={<InAppConnectEmbed />}
        code={`import { inAppWallet } from "thirdweb/wallets";
        import { ConnectEmbed } from "thirdweb/react";


        const wallets = [
          inAppWallet(
            // built-in auth methods
            { auth: {
              options: [ 
              "google",
              "x",
              "apple",
              "discord",
              "facebook",
              "farcaster",
              "telegram",
              "coinbase",
              "line",
              "email",
              "phone",
              "passkey",
              "guest",
              ]
              }
            }
            // or bring your own auth endpoint
          )
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
