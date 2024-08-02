import { getIpAddress } from "lib/ip";
import { cacheTtl } from "lib/redis";
import type { ChainMetadata } from "thirdweb/chains";
import { ChainIcon } from "../../../../components/server/chain-icon";
import { FaucetButton } from "../client/FaucetButton";
import { GiftIcon } from "../icons/GiftIcon";
import { SectionTitle } from "./SectionTitle";

const amountToGive = "0.1";

export async function FaucetSection(props: { chain: ChainMetadata }) {
  const { chain } = props;

  // Check eligibilty.
  const ipAddress = getIpAddress();
  const cacheKey = `testnet-faucet:${chain.chainId}:${ipAddress}`;
  const ttlSeconds = await cacheTtl(cacheKey);
  const sanitizedChainName = chain.name.replace("Mainnet", "").trim();

  return (
    <section>
      <SectionTitle title="Faucet" />
      <div className="border border-border px-4 py-10 rounded-lg flex justify-center">
        <div className="max-w-[520px] w-full flex flex-col items-center ">
          <div className="flex items-center">
            <ChainIcon
              className="size-12 -mr-2 rounded-full border p-1"
              iconUrl={props.chain.icon?.url}
            />
            <GiftIcon bg="hsl(var(--background))" className="size-12 -ml-2" />
          </div>

          <div className="h-6" />

          <h2 className="text-lg tracking-tight font-semibold text-center px-4">
            {sanitizedChainName} Faucet
          </h2>

          <div className="h-2" />

          <p className="text-secondary-foreground text-sm max-w-[520px] text-center px-4">
            Get free {chain.nativeCurrency.symbol} fast and reliably.{" "}
            {amountToGive} {chain.nativeCurrency.symbol}/day.
          </p>

          <div className="h-8" />

          <FaucetButton
            chain={chain}
            ttlSeconds={ttlSeconds}
            amount={amountToGive}
          />
        </div>
      </div>
    </section>
  );
}
