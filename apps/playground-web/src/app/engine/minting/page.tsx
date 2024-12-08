import { ERC1155MintTo } from "@/components/engine/minting/erc1155-mint-to";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { EngineAPIHeader } from "../../../components/blocks/EngineAPIHeader";
// TODO: Get updated banner image and description.
export default function Page() {
  return (
    <ThirdwebProvider>
      <main className="container px-0 pb-20">
        <EngineAPIHeader
          title="Minting"
          description={
            <>
              Allow your users to mint new tokens into any given contract. You
              sponsor the gas so your users only need a wallet address!
            </>
          }
          deployLink="https://thirdweb.com/team/~/~/engine/create?utm_source=playground"
          docsLink="https://thirdweb-engine.apidocumentation.com/reference#tag/erc1155/POST/contract/{chain}/{contractAddress}/erc1155/mint-to?utm_source=playground"
          heroLink="/minting.avif"
        />

        <section>
          <Minting />
        </section>
      </main>
    </ThirdwebProvider>
  );
}

function Minting() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="font-semibold text-2xl tracking-tight sm:text-3xl">
          Minting
        </h2>
        <p className="max-w-[600px]">
          Allow your users to mint new tokens into any given contract. You
          sponsor the gas so your users only need a wallet address!
        </p>
      </div>
      <ERC1155MintTo />
    </>
  );
}
