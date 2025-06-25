"use client";
import { defineChain, type ThirdwebClient } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { BuyWidget } from "thirdweb/react";

export function BuyFundsSection(props: {
  chain: ChainMetadata;
  client: ThirdwebClient;
}) {
  return (
    <section className="flex flex-col gap-4 items-center justify-center">
      <BuyWidget
        amount="0"
        // eslint-disable-next-line no-restricted-syntax
        chain={defineChain(props.chain.chainId)}
        client={props.client}
      />
    </section>
  );
}
