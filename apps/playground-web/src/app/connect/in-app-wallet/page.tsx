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
        <h3 className="mb-3 font-medium text-lg">Custom Auth and UI</h3>
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
          code={`import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useConnect } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";

export function CustomLoginForm() {
  const [email, setEmail] = useState("");
  const { connect, isConnecting, error } = useConnect();

  const { mutate: loginWithCustomAuth } = useMutation({
    mutationFn: async (email: string) => {
      const wallet = await connect(async () => {
        const wallet = inAppWallet();
        await wallet.connect({
          strategy: "auth_endpoint",
          client,
          // your own custom auth payload here
          payload: JSON.stringify({
            userId: email,
            email,
          }),
        });
        return wallet;
      });
      return wallet;
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginWithCustomAuth(email);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <button
          type="submit"
          disabled={isConnecting || !email}
        >
          {isConnecting ? "Submitting..." : "Submit"}
        </button>
        {error && <p>{error.message}</p>}
      </div>
    </form>
  );
}
`}
          lang="tsx"
        />
      </div>
    </>
  );
}
