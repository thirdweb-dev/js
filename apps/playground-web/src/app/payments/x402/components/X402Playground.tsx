"use client";

import React, { useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { chain, token } from "./constants";
import type { X402PlaygroundOptions } from "./types";
import { X402LeftSection } from "./X402LeftSection";
import { X402RightSection } from "./X402RightSection";

const defaultOptions: X402PlaygroundOptions = {
  chain: chain,
  tokenAddress: token.address as `0x${string}`,
  tokenSymbol: token.symbol,
  tokenDecimals: token.decimals,
  amount: "0.01",
  payTo: "0x0000000000000000000000000000000000000000",
};

export function X402Playground() {
  const [options, setOptions] = useState<X402PlaygroundOptions>(defaultOptions);
  const activeAccount = useActiveAccount();

  // Update payTo address when wallet connects, but only if it's still the default
  React.useEffect(() => {
    if (
      activeAccount?.address &&
      options.payTo === "0x0000000000000000000000000000000000000000"
    ) {
      setOptions((prev) => ({
        ...prev,
        payTo: activeAccount.address as `0x${string}`,
      }));
    }
  }, [activeAccount?.address, options.payTo]);

  return (
    <div className="relative flex flex-col-reverse gap-6 xl:min-h-[900px] xl:flex-row xl:gap-6">
      <div className="grow border-b pb-10 xl:mb-0 xl:border-r xl:border-b-0 xl:pr-6">
        <X402LeftSection options={options} setOptions={setOptions} />
      </div>
      <X402RightSection options={options} />
    </div>
  );
}
