import { PanelTopIcon } from "lucide-react";
import { PageLayout } from "@/components/blocks/APIHeader";
import { CodeExample } from "@/components/code/code-example";
import { StyledConnectEmbed } from "@/components/styled-connect-embed";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { createMetadata } from "@/lib/metadata";

const title = "Connect Embed";
const description =
  "Embeddable wallet component to manage logged in wallet states, view wallet balance, view assets, or buy and receive funds within an application.";
const ogDescription =
  "Wallet component to manage logged in wallet, view wallet balance, view assets, or buy and receive funds within an application";

export const metadata = createMetadata({
  description: ogDescription,
  title,
  image: {
    icon: "wallets",
    title,
  },
});

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        icon={PanelTopIcon}
        title={title}
        description={description}
        docsLink="https://portal.thirdweb.com/wallets?utm_source=playground"
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
