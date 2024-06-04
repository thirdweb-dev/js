"use client";

import { CodeExample } from "../code/code-example";
import { StyledConnectEmbed } from "../styled-connect-embed";

export function AnyAuth() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
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
        preview={<StyledConnectEmbed />}
        code={`import { inAppWallet } from "thirdweb/wallets";
        import { ConnectEmbed } from "thirdweb/react";

        
        const wallets = [
          inAppWallet(
            // built-in auth methods
            { auth: { 
              options: ["email", "phone", "passkey", "google", "apple", "facebook"] 
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
