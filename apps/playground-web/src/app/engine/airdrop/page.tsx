import { EngineAirdropPreview } from "@/app/engine/airdrop/_components/airdrop-preview";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { PageLayout } from "../../../components/blocks/APIHeader";
import { AirdropCode } from "./_components/airdrop-code";

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        title="Airdrop"
        description={
          <>
            Engine makes it effortless for any developer to airdrop tokens at
            scale. You sponsor the gas so your users only need a wallet address!
          </>
        }
        docsLink="https://thirdweb-engine.apidocumentation.com/reference#tag/erc20/POST/contract/{chain}/{contractAddress}/erc20/mint-batch-to?utm_source=playground"
      >
        <EngineAirdropPreview />
        <div className="h-10" />
        <AirdropCode />
      </PageLayout>
    </ThirdwebProvider>
  );
}
