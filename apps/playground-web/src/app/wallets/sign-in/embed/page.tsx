import type { Metadata } from "next";
import { CodeExample } from "@/components/code/code-example";
import { StyledConnectEmbed } from "@/components/styled-connect-embed";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { metadataBase } from "@/lib/constants";
import { PageLayout } from "../../../../components/blocks/APIHeader";

export const metadata: Metadata = {
  description:
    "Let users sign up with their email, phone number, social media accounts or directly with a wallet. Seamlessly integrate account abstraction and SIWE auth.",
  metadataBase,
  title: "Sign In, Account Abstraction and SIWE Auth | thirdweb ConnectEmbed",
};

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        description={
          <>
            Create a login experience tailor-made for your app. Add your wallets
            of choice, enable web2 sign-in options and create a modal that fits
            your brand.
          </>
        }
        docsLink="https://portal.thirdweb.com/wallets?utm_source=playground"
        title="ConnectEmbed"
      >
        <EmbedComponent />
      </PageLayout>
    </ThirdwebProvider>
  );
}

function EmbedComponent() {
  return (
    <CodeExample
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
      preview={<StyledConnectEmbed />}
    />
  );
}
