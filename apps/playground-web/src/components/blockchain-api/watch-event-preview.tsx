"use client";

import { THIRDWEB_CLIENT } from "@/lib/client";
import { useEffect, useState } from "react";
import { getContract, toTokens } from "thirdweb";
import { base } from "thirdweb/chains";
import { useContractEvents } from "thirdweb/react";
import { transferEvent } from "thirdweb/extensions/erc20";

type Item = {
  from: string;
  to: string;
  value: string;
};

const shortenAddress = (address: string, length = 2) => {
  return `${address.slice(0, length + 2)}...${address.slice(-length)}`;
};

const usdcContractOnBase = getContract({
  address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  chain: base,
  client: THIRDWEB_CLIENT,
});

export function WatchEventPreview() {
  const [items, setItems] = useState<Item[]>([]);
  const contractEvents = useContractEvents({
    contract: usdcContractOnBase,
    events: [transferEvent()],
    blockRange: 5,
  });

  useEffect(() => {
    if (!contractEvents.data?.length) return;
    const _items: Item[] = contractEvents.data
      .map((item) => {
        const { from, to, value } = item.args;
        return {
          from: shortenAddress(from),
          to: shortenAddress(to),
          value: Number(toTokens(value, 6)).toFixed(1),
        };
      })
      .slice(-5);
    setItems(_items);
  }, [contractEvents.data]);
  return (
    <>
      <ul className="text-center text-sm lg:text-base">
        {items.map((item, index) => (
          <li key={index}>
            <span className="font-bold">{item.from}</span> transferred{" "}
            <span className="font-bold text-green-500">{item.value} USDC</span>{" "}
            to <span className="font-bold">{item.to}</span>
          </li>
        ))}
      </ul>
    </>
  );
}
