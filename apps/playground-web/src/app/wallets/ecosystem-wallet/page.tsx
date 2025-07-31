import { AtomIcon } from "lucide-react";
import { PageLayout } from "@/components/blocks/APIHeader";
import { CodeExample } from "@/components/code/code-example";
import { EcosystemConnectEmbed } from "@/components/in-app-wallet/ecosystem";
import { Profiles } from "@/components/in-app-wallet/profile-sections";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { createMetadata } from "@/lib/metadata";

const title = "Ecosystem Wallets";
const description =
  "Enable global wallet-based identity across apps and games. Create public or permissioned ecosystems where users keep one account everywhere.";

export const metadata = createMetadata({
  description: description,
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
        icon={AtomIcon}
        title={title}
        description={description}
        docsLink="https://portal.thirdweb.com/wallets/ecosystem/set-up?utm_source=playground"
      >
        <ConnectEmbedExample />
        <div className="h-14" />
        <Profiles />
      </PageLayout>
    </ThirdwebProvider>
  );
}

function ConnectEmbedExample() {
  return (
    <CodeExample
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
      header={{
        description:
          "Connect to your ecosystem with a prebuilt UI. All settings are controlled in your dashboard.",
        title: "Connect Embed",
      }}
      lang="tsx"
      preview={<EcosystemConnectEmbed />}
    />
  );
}
