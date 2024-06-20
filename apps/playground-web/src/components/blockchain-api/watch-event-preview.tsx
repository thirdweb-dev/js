"use client";

import { THIRDWEB_CLIENT } from "@/lib/client";
import { useMemo } from "react";
import { getContract, toTokens } from "thirdweb";
import { base } from "thirdweb/chains";
import { transferEvent } from "thirdweb/extensions/erc20";
import { useContractEvents } from "thirdweb/react";
import { shortenAddress } from "./shortenAddress";

type Item = {
  from: string;
  to: string;
  value: string;
};

const usdcContractOnBase = getContract({
  address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  chain: base,
  client: THIRDWEB_CLIENT,
});

export function WatchEventPreview() {
  const contractEvents = useContractEvents({
    contract: usdcContractOnBase,
    events: [transferEvent()],
    blockRange: 10,
  });

  const items: Item[] = useMemo(() => {
    if (!contractEvents.data?.length) return [];
    return contractEvents.data
      .map((item) => {
        const { from, to, value } = item.args;
        return {
          from: shortenAddress(from),
          to: shortenAddress(to),
          value: Number(toTokens(value, 6)).toFixed(1),
        };
      })
      .slice(-5);
  }, [contractEvents.data]);

  return (
    <ul className="text-center text-sm lg:text-base">
      {items.map((item, index) => (
        <li key={index}>
          <span className="font-bold">{item.from}</span> transferred{" "}
          <span className="font-bold text-green-500">{item.value} USDC</span> to{" "}
          <span className="font-bold">{item.to}</span>
        </li>
      ))}
    </ul>
  );
}
