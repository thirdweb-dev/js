import { EngineMintPreview } from "@/app/transactions/minting/_components/mint-preview";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { PageLayout } from "../../../components/blocks/APIHeader";
import { MintCode } from "./_components/mint-code";

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        description={
          <>
            Allow your users to mint new tokens into any given contract. You
            sponsor the gas so your users only need a wallet address!
          </>
        }
        docsLink="https://thirdweb-engine.apidocumentation.com/reference#tag/erc1155/POST/contract/{chain}/{contractAddress}/erc1155/mint-to?utm_source=playground"
        title="Mint Dynamic NFTs"
      >
        <EngineMintPreview />
        <div className="h-10" />
        <MintCode />
      </PageLayout>
    </ThirdwebProvider>
  );
}
