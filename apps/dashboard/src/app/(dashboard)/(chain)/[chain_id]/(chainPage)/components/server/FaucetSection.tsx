import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import type { ChainMetadata } from "thirdweb/chains";
import { getFaucetClaimAmount } from "../../../../../../api/testnet-faucet/claim/claim-amount";
import { ChainIcon } from "../../../../components/server/chain-icon";
import { FaucetButton } from "../client/FaucetButton";
import { GiftIcon } from "../icons/GiftIcon";
import { SectionTitle } from "./SectionTitle";

export async function FaucetSection(props: {
  chain: ChainMetadata;
  twAccount: Account | undefined;
}) {
  const { chain, twAccount } = props;

  // Check eligibility.
  const sanitizedChainName = chain.name.replace("Mainnet", "").trim();
  const amountToGive = getFaucetClaimAmount(props.chain.chainId);

  return (
    <section>
      <SectionTitle title="Faucet" />
      <div className="flex justify-center rounded-lg border border-border bg-muted/50 px-4 py-10">
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
            chain={chain}
            amount={amountToGive}
            twAccount={twAccount}
          />
        </div>
      </div>
    </section>
  );
}
