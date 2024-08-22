import { CodeExample } from "@/components/code/code-example";
import { StyledConnectEmbed } from "@/components/styled-connect-embed";
import { metadataBase } from "@/lib/constants";
import type { Metadata } from "next";
import { APIHeader } from "../../../../components/blocks/APIHeader";

export const metadata: Metadata = {
  metadataBase,
  title: "Sign In, Account Abstraction and SIWE Auth | thirdweb ConnectEmbed",
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

      <EmbedComponent />
    </main>
  );
}

function EmbedComponent() {
  return (
    <>
      <div className="mb-4">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-2">
          Embed Component
        </h2>
        <p className="max-w-[700px] text-muted-foreground">
          Inline component to connect to various wallets.
          <br />
          Use this to create your own full screen login page.
        </p>
      </div>

      <CodeExample
        preview={<StyledConnectEmbed />}
        code={`import { createThirdwebClient } from "thirdweb";
import { ConnectEmbed } from "thirdweb/react";

const THIRDWEB_CLIENT = createThirdwebClient({
clientId: "<YOUR_CLIENT_ID>"
});

function App(){
return (
<ConnectEmbed client={THIRDWEB_CLIENT} />
);
};`}
        lang="tsx"
      />
    </>
  );
}
