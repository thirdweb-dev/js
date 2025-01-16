import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import type { ChainMetadata } from "thirdweb/chains";
import { ChainIcon } from "../../../../components/server/chain-icon";
import { PayModalButton } from "../client/PayModal";
import { CreditCardIcon } from "../icons/CreditCardIcon";
import { SectionTitle } from "./SectionTitle";

export function BuyFundsSection(props: { chain: ChainMetadata }) {
  const sanitizedChainName = props.chain.name.replace("Mainnet", "").trim();

  return (
    <section>
      <SectionTitle title="Buy Funds" />
      <div className="flex justify-center rounded-lg border border-border bg-card px-4 py-10">
        <div className="flex max-w-[520px] flex-col items-center ">
          <div className="flex items-center">
            <ChainIcon
              className="-mr-2 size-12 rounded-full border p-1"
              iconUrl={props.chain.icon?.url}
            />
            <CreditCardIcon
              bg="hsl(var(--background))"
              className="-ml-2 size-12"
            />
          </div>

          <div className="h-6" />

          <h2 className="px-4 text-center font-semibold text-lg tracking-tight">
            Buy Funds on {sanitizedChainName} using thirdweb Pay
          </h2>

          <div className="h-2" />

          <p className="max-w-[520px] px-4 text-center text-muted-foreground text-sm">
            Instantly onramp, bridge & swap into {sanitizedChainName} with any
            token.
          </p>

          <div className="h-8" />

          <PayModalButton
            chainId={props.chain.chainId}
            label={`Buy Funds on ${sanitizedChainName}`}
          />

          <div className="h-4" />

          <Link
            href="https://portal.thirdweb.com/connect/pay/overview"
            className="inline-flex items-center gap-1.5 text-muted-foreground text-sm hover:text-foreground"
          >
            Learn more about thirdweb Pay
            <ExternalLinkIcon className="size-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}
