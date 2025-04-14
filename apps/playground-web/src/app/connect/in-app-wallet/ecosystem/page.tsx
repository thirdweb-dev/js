import { CodeExample } from "@/components/code/code-example";
import type { Metadata } from "next";
import { PageLayout } from "../../../../components/blocks/APIHeader";
import { EcosystemConnectEmbed } from "../../../../components/in-app-wallet/ecosystem";
import { Profiles } from "../../../../components/in-app-wallet/profile-sections";
import ThirdwebProvider from "../../../../components/thirdweb-provider";
import { metadataBase } from "../../../../lib/constants";

export const metadata: Metadata = {
  metadataBase,
  title: "Build your own Ecosystem | thirdweb",
  description:
    "Build a public or permissioned ecosystem by allowing third party apps and games to connect to the same accounts.",
};

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        title="Build your own Ecosystem"
        description={
          <>
            Build a public or permissioned ecosystem by allowing third party
            apps and games to connect to the same accounts.
          </>
        }
        docsLink="https://portal.thirdweb.com/connect/wallet/ecosystem/set-up?utm_source=playground"
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
      header={{
        title: "Connect Embed",
        description:
          "Connect to your ecosystem with a prebuilt UI. All settings are controlled in your dashboard.",
      }}
      preview={<EcosystemConnectEmbed />}
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
      lang="tsx"
    />
  );
}
