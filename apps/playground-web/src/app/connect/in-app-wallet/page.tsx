import { CodeExample } from "@/components/code/code-example";
import { CustomLoginForm } from "@/components/in-app-wallet/custom-login-form";
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
      <div className="space-y-2">
        <h3 className="mb-3 font-medium text-lg">Prebuilt UI</h3>
        <p className="max-w-[600px]">
          Instant out of the box authentication with a prebuilt UI.
        </p>
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
      </div>
      <div className="space-y-2">
        <h3 className="mb-3 font-medium text-lg">Custom UI</h3>
        <p className="max-w-[600px]">
          Customize the login UI and integrate with your existing user base. No
          limits on customizations and auth methods.
        </p>
        <CodeExample
          preview={
            <div className="w-1/2">
              <CustomLoginForm />
            </div>
          }
          code={`import { useState } from "react";
import { useConnect } from "thirdweb/react";
import { inAppWallet, preAuthenticate } from "thirdweb/wallets/in-app";

export function CustomLoginUi() {
  const { connect, isConnecting, error } = useConnect();

  const preLogin = async (email: string) => {
    // send email verification code
    await preAuthenticate({
      client,
      strategy: "email",
      email,
    });
  };

  const handleLogin = async (email: string, verificationCode: string) => {
    // verify email with verificationCode and connect
    connect(async () => {
      const wallet = inAppWallet();
      await wallet.connect({
        client,
        strategy: "email",
        email,
        verificationCode,
      });
      return wallet;
    });
  };
}
`}
          lang="tsx"
        />
      </div>
    </>
  );
}
