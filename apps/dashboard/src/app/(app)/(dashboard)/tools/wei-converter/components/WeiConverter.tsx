"use client";

import { useId, useState } from "react";
import { toEther, toTokens, toWei } from "thirdweb";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    } catch {}
  };

  const weiInputId = useId();
  const gweiInputId = useId();
  const etherInputId = useId();

  return (
    <div className="space-y-24">
      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Label className="min-w-64 text-xl" htmlFor={weiInputId}>
            Wei
          </Label>
          <Input
            className="p-6 text-xl"
            id={weiInputId}
            onChange={(e) => onChange({ wei: e.target.value })}
            value={wei}
          />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Label className="min-w-64 text-xl" htmlFor={gweiInputId}>
            Gwei
          </Label>
          <Input
            className="p-6 text-xl"
            id={gweiInputId}
            onChange={(e) => onChange({ gwei: e.target.value })}
            value={gwei}
          />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Label className="min-w-64 text-xl" htmlFor={etherInputId}>
            Ether
          </Label>
          <Input
            className="p-6 text-xl"
            id={etherInputId}
            onChange={(e) => onChange({ ether: e.target.value })}
            value={ether}
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
            className="underline"
            href="https://portal.thirdweb.com/typescript/v5"
            rel="noopener noreferrer"
            target="_blank"
          >
            Connect SDK
          </a>
          :
        </p>
        <div>
          <CopyTextButton
            copyIconPosition="right"
            textToCopy={`toTokens(${wei}n, 9)`}
            textToShow={`toTokens(${wei}n, 9)`}
            tooltip="Copy"
          />
        </div>
        <div>
          <CopyTextButton
            copyIconPosition="right"
            textToCopy={`toEther(${wei}n)`}
            textToShow={`toEther(${wei}n)`}
            tooltip="Copy"
          />
        </div>
      </Card>

      <div className="space-y-4">
        <h1 className="font-bold text-2xl">
          Convert between wei, gwei, and ether units
        </h1>
        <h2 className="font-bold text-md">What is wei?</h2>
        <ul className="ml-5 list-disc">
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
        <h2 className="font-bold text-md">What is gwei?</h2>
        <ul className="ml-5 list-disc">
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
        <h2 className="font-bold text-md">What is ether?</h2>
        <ul className="ml-5 list-disc">
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
