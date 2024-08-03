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
      <div className="border border-border px-4 py-10 rounded-lg flex justify-center">
        <div className="max-w-[520px] flex flex-col items-center ">
          <div className="flex items-center">
            <ChainIcon
              className="size-12 -mr-2 rounded-full border p-1"
              iconUrl={props.chain.icon?.url}
            />
            <CreditCardIcon
              bg="hsl(var(--background))"
              className="size-12 -ml-2"
            />
          </div>

          <div className="h-6" />

          <h2 className="text-lg tracking-tight font-semibold text-center px-4">
            Buy Funds on {sanitizedChainName} using thirdweb Pay
          </h2>

          <div className="h-2" />

          <p className="text-secondary-foreground text-sm max-w-[520px] text-center px-4">
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
            className="inline-flex gap-1.5 items-center text-sm text-secondary-foreground hover:text-foreground"
          >
            Learn more about thirdweb Pay{" "}
            <ExternalLinkIcon className="size-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}
