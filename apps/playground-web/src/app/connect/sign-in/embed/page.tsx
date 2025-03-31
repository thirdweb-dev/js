import { CodeExample } from "@/components/code/code-example";
import { StyledConnectEmbed } from "@/components/styled-connect-embed";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { metadataBase } from "@/lib/constants";
import type { Metadata } from "next";
import { APIHeader } from "../../../../components/blocks/APIHeader";

export const metadata: Metadata = {
  metadataBase,
  title: "Sign In, Account Abstraction and SIWE Auth | thirdweb ConnectEmbed",
  description:
    "Let users sign up with their email, phone number, social media accounts or directly with a wallet. Seamlessly integrate account abstraction and SIWE auth.",
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
          docsLink="https://portal.thirdweb.com/connect/sign-in/overview?utm_source=playground"
          heroLink="/connectors.png"
        />

        <EmbedComponent />
      </main>
    </ThirdwebProvider>
  );
}

function EmbedComponent() {
  return (
    <>
      <div className="mb-4">
        <h2 className="mb-2 font-semibold text-2xl tracking-tight sm:text-3xl">
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
