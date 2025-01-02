import { AirdropERC20 } from "@/components/engine/airdrop/airdrop-erc20";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { EngineAPIHeader } from "../../../components/blocks/EngineAPIHeader";
// TODO: Get updated banner image and description.
export default function Page() {
  return (
    <ThirdwebProvider>
      <main className="container px-0 pb-20">
        <EngineAPIHeader
          title="Airdrop"
          description={
            <>
              Engine makes it effortless for any developer to airdrop tokens at
              scale. You sponsor the gas so your users only need a wallet
              address!
            </>
          }
          deployLink="https://thirdweb.com/team/~/~/engine/create?utm_source=playground"
          docsLink="https://thirdweb-engine.apidocumentation.com/reference#tag/erc20/POST/contract/{chain}/{contractAddress}/erc20/mint-batch-to?utm_source=playground"
          heroLink="/airdrop.avif"
        />

        <section>
          <InGameCurrency />
        </section>
      </main>
    </ThirdwebProvider>
  );
}

function InGameCurrency() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="font-semibold text-2xl tracking-tight sm:text-3xl">
          Airdrop
        </h2>
        <p className="max-w-[600px]">
          Use Engine to Airdrop in-game currency to a list of players in one
          transaction.
        </p>
      </div>
      <AirdropERC20 />
    </>
  );
}
