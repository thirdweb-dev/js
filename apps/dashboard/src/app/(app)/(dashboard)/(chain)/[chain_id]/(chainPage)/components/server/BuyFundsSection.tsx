import { defineChain, type ThirdwebClient } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { SectionTitle } from "./SectionTitle";
import { BuyWidget } from "thirdweb/react";

export function BuyFundsSection(props: {
  chain: ChainMetadata;
  client: ThirdwebClient;
}) {
  return (
    <section className="flex flex-col gap-4 items-center justify-center">
      <SectionTitle title="Bridge" />
      <BuyWidget
        client={props.client}
        chain={defineChain(props.chain.chainId)}
        amount="0.01"
      />
    </section>
  );
}
