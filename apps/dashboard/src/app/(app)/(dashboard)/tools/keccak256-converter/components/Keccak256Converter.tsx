"use client";

import { useId, useState } from "react";
import { keccakId } from "thirdweb/utils";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShareButton } from "../../components/share";

export const Keccak256Converter = () => {
  const [rawString, setRawString] = useState("MINTER_ROLE");
  const keccak256Hash = keccakId(rawString);

  const rawStringId = useId();

  return (
    <div className="space-y-24">
      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Label className="min-w-64 text-xl" htmlFor={rawStringId}>
            Input String
          </Label>
          <Input
            className="p-6 text-xl"
            id={rawStringId}
            onChange={(e) => setRawString(e.target.value)}
            value={rawString}
          />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Label className="min-w-64 text-xl">Keccak-256 Hash</Label>
          <CopyTextButton
            className="overflow-auto font-mono text-xl"
            copyIconPosition="right"
            textToCopy={keccak256Hash}
            textToShow={keccak256Hash}
            tooltip="Copy"
          />
        </div>

        <div className="mt-4 flex justify-end">
          <ShareButton
            cta="Share on X"
            href="https://twitter.com/intent/tweet?text=Easy-to-use%20Keccak-256%20converter%20by%20thirdweb%20%F0%9F%98%8D&url=https%3A%2F%2Fthirdweb.com%2Ftools%2Fkeccak256-converter"
          />
        </div>
      </div>

      <Card className="flex flex-col gap-2 p-4">
        <p>
          Convert values using the{" "}
          <a
            className="underline"
            href="https://portal.thirdweb.com/typescript/v5"
            rel="noopener noreferrer"
            target="_blank"
          >
            thirdweb SDK
          </a>
          :
        </p>
        <div>
          <CopyTextButton
            className="font-mono"
            copyIconPosition="right"
            textToCopy={`keccakId("${rawString}")`}
            textToShow={`keccakId("${rawString}")`}
            tooltip="Copy"
          />
        </div>
      </Card>

      <div className="space-y-4">
        <h1 className="font-bold text-2xl">
          Convert a string to Keccak-256 hash
        </h1>

        <p>
          Keccak-256, part of the Keccak hash family, is favored in Ethereum
          Virtual Machine (EVM) for:
        </p>
        <h2 className="font-bold text-md">Security</h2>
        <p>Strong cryptographic properties ensure collision resistance.</p>
        <h2 className="font-bold text-md">Compatibility</h2>
        <p>Adopted in Ethereum for hashing and signing.</p>
        <h2 className="font-bold text-md">Standardization</h2>
        <p>Widely recognized and standardized.</p>
        <h2 className="font-bold text-md">Gas Efficiency</h2>
        <p>
          Efficient for EVM's gas limits, used in smart contracts and blockchain
          operations.
        </p>
      </div>
    </div>
  );
};
