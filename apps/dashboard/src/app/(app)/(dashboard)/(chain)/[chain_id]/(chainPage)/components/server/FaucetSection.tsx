import type { ThirdwebClient } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { getFaucetClaimAmount } from "../../../../../../api/testnet-faucet/claim/claim-amount";
import { ChainIcon } from "../../../../components/server/chain-icon";
import { FaucetButton } from "../client/FaucetButton";
import { GiftIcon } from "../icons/GiftIcon";
import { SectionTitle } from "./SectionTitle";

export async function FaucetSection(props: {
  chain: ChainMetadata;
  isLoggedIn: boolean;
  client: ThirdwebClient;
}) {
  const { chain, isLoggedIn, client } = props;

  // Check eligibility.
  const sanitizedChainName = chain.name.replace("Mainnet", "").trim();
  const amountToGive = getFaucetClaimAmount(props.chain.chainId);

  return (
    <section>
      <SectionTitle title="Faucet" />
      <div className="flex justify-center rounded-lg border border-border bg-card px-4 py-10">
        <div className="flex w-full max-w-[520px] flex-col items-center ">
          <div className="flex items-center">
            <ChainIcon
              className="-mr-2 size-12 rounded-full border p-1"
              iconUrl={props.chain.icon?.url}
            />
            <GiftIcon bg="hsl(var(--background))" className="-ml-2 size-12" />
          </div>

          <div className="h-6" />

          <h2 className="px-4 text-center font-semibold text-lg tracking-tight">
            {sanitizedChainName} Faucet
          </h2>

          <div className="h-2" />

          <p className="max-w-[520px] px-4 text-center text-muted-foreground text-sm">
            Get free {chain.nativeCurrency.symbol} fast and reliably.{" "}
            {amountToGive} {chain.nativeCurrency.symbol}/day.
          </p>

          <div className="h-8" />

          <FaucetButton
            amount={amountToGive}
            chain={chain}
            client={client}
            isLoggedIn={isLoggedIn}
          />
        </div>
      </div>
    </section>
  );
}
