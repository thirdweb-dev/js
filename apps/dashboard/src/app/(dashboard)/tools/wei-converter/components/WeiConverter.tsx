"use client";

import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toEther, toTokens, toWei } from "thirdweb";
import { ShareButton } from "../../components/share";

export const WeiConverter = () => {
  const [wei, setWei] = useState("1000000000");
  const [gwei, setGwei] = useState("1");
  const [ether, setEther] = useState("0.000000001");

  const onChange = (args: { wei?: string; gwei?: string; ether?: string }) => {
    try {
      let _wei = 0n;
      if (args.wei) {
        _wei = BigInt(args.wei);
      } else if (args.gwei) {
        _wei = BigInt(args.gwei) * BigInt(10 ** 9);
      } else if (args.ether) {
        _wei = toWei(args.ether);
      }
      setWei(_wei.toString());
      setGwei(toTokens(_wei, 9));
      setEther(toEther(_wei));
    } catch (e) {}
  };

  return (
    <div className="space-y-24">
      <div className="space-y-4">
        <div className="flex gap-2 sm:items-center flex-col sm:flex-row">
          <Label htmlFor="wei-input" className="min-w-64 text-xl">
            Wei
          </Label>
          <Input
            id="wei-input"
            value={wei}
            onChange={(e) => onChange({ wei: e.target.value })}
            className="text-xl p-6"
          />
        </div>
        <div className="flex gap-2 sm:items-center flex-col sm:flex-row">
          <Label htmlFor="gwei-input" className="min-w-64 text-xl">
            Gwei
          </Label>
          <Input
            id="gwei-input"
            value={gwei}
            onChange={(e) => onChange({ gwei: e.target.value })}
            className="text-xl p-6"
          />
        </div>
        <div className="flex gap-2 sm:items-center flex-col sm:flex-row">
          <Label htmlFor="ether-input" className="min-w-64 text-xl">
            Ether
          </Label>
          <Input
            id="ether-input"
            value={ether}
            onChange={(e) => onChange({ ether: e.target.value })}
            className="text-xl p-6"
          />
        </div>
        <div className="flex justify-end">
          <ShareButton
            cta="Share on X"
            href="https://twitter.com/intent/tweet?text=Easy-to-use%20wei%20converter%20by%20thirdweb%20%F0%9F%98%8D&url=https%3A%2F%2Fthirdweb.com%2Ftools%2Fwei-converter"
          />
        </div>
      </div>

      <Card className="flex flex-col gap-2 p-4">
        <p>
          Or use the{" "}
          <a
            href="https://portal.thirdweb.com/typescript/v5"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Connect SDK
          </a>
          :
        </p>
        <div>
          <CopyTextButton
            textToShow={`toTokens(${wei}n, 9)`}
            textToCopy={`toTokens(${wei}n, 9)`}
            tooltip="Copy"
            copyIconPosition="right"
          />
        </div>
        <div>
          <CopyTextButton
            textToShow={`toEther(${wei}n)`}
            textToCopy={`toEther(${wei}n)`}
            tooltip="Copy"
            copyIconPosition="right"
          />
        </div>
      </Card>

      <div className="space-y-4">
        <h1 className="text-2xl font-bold">
          Convert between wei, gwei, and ether units
        </h1>
        <h2 className="text-md font-bold">What is wei?</h2>
        <ul className="list-disc ml-5">
          <li>
            <strong>Definition:</strong> The smallest denomination of Ether,
            used for precise calculations.
          </li>
          <li>
            <strong>Value:</strong> 1 Wei = 10^-18 Ether.
          </li>
          <li>
            <strong>Usage:</strong> Often used in smart contract operations and
            for precise handling of Ether values.
          </li>
        </ul>
        <h2 className="text-md font-bold">What is gwei?</h2>
        <ul className="list-disc ml-5">
          <li>
            <strong>Definition:</strong> A commonly used denomination of Ether,
            particularly for gas prices.
          </li>
          <li>
            <strong>Value:</strong> 1 Gwei = 10^9 Wei = 10^-9 Ether.
          </li>
          <li>
            <strong>Usage:</strong> Typically used to express gas prices in
            transactions on the Ethereum network.
          </li>
        </ul>
        <h2 className="text-md font-bold">What is ether?</h2>
        <ul className="list-disc ml-5">
          <li>
            <strong>Definition:</strong> The primary unit of currency on the
            Ethereum blockchain.
          </li>
          <li>
            <strong>Value:</strong> 1 Ether = 10^18 Wei = 10^9 Gwei.
          </li>
          <li>
            <strong>Usage:</strong> Commonly used for representing user-friendly
            token amounts and for transactions between users.
          </li>
        </ul>
      </div>
    </div>
  );
};
