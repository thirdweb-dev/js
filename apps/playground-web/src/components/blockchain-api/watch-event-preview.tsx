"use client";

import { useMemo } from "react";
import { getContract, toTokens } from "thirdweb";
import { base } from "thirdweb/chains";
import { transferEvent } from "thirdweb/extensions/erc20";
import { useContractEvents } from "thirdweb/react";
import { THIRDWEB_CLIENT } from "@/lib/client";
import { shortenAddress } from "./shortenAddress";

type Item = {
  from: string;
  to: string;
  value: string;
  hash: string;
};

const usdcContractOnBase = getContract({
  address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  chain: base,
  client: THIRDWEB_CLIENT,
});

export function WatchEventPreview() {
  const contractEvents = useContractEvents({
    blockRange: 100,
    contract: usdcContractOnBase,
    events: [transferEvent()],
  });

  const items: Item[] = useMemo(() => {
    if (!contractEvents.data?.length) return [];
    return contractEvents.data
      .map((item) => {
        const { from, to, value } = item.args;
        return {
          from: shortenAddress(from),
          hash: item.transactionHash,
          to: shortenAddress(to),
          value: Number(toTokens(value, 6)).toFixed(1),
        };
      })
      .filter(
        (item, index, self) =>
          self.findIndex((i) => i.hash === item.hash) === index,
      )
      .slice(-5);
  }, [contractEvents.data]);

  return (
    <ul className="m-auto text-sm lg:text-base">
      {items.map((item) => (
        <li key={item.hash}>
          <span className="font-bold">{item.from}</span> transferred{" "}
          <span className="font-bold text-green-500">{item.value} USDC</span> to{" "}
          <span className="font-bold">{item.to}</span>
        </li>
      ))}
    </ul>
  );
}
