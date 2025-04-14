import { CodeExample } from "@/components/code/code-example";
import { StyledConnectEmbed } from "@/components/styled-connect-embed";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { metadataBase } from "@/lib/constants";
import type { Metadata } from "next";
import { PageLayout } from "../../../../components/blocks/APIHeader";

export const metadata: Metadata = {
  metadataBase,
  title: "Sign In, Account Abstraction and SIWE Auth | thirdweb ConnectEmbed",
  description:
    "Let users sign up with their email, phone number, social media accounts or directly with a wallet. Seamlessly integrate account abstraction and SIWE auth.",
};

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        title="ConnectEmbed"
        description={
          <>
            Create a login experience tailor-made for your app. Add your wallets
            of choice, enable web2 sign-in options and create a modal that fits
            your brand.
          </>
        }
        docsLink="https://portal.thirdweb.com/connect/sign-in/overview?utm_source=playground"
      >
        <EmbedComponent />
      </PageLayout>
    </ThirdwebProvider>
  );
}

function EmbedComponent() {
  return (
    <>
      <CodeExample
        preview={<StyledConnectEmbed />}
        code={`import { createThirdwebClient } from "thirdweb";
import { ConnectEmbed } from "thirdweb/react";

const thirdwebClient = createThirdwebClient({
clientId: "<YOUR_CLIENT_ID>"
});

function App(){
return (
<ConnectEmbed client={thirdwebClient} />
);
};`}
        lang="tsx"
      />
    </>
  );
}
