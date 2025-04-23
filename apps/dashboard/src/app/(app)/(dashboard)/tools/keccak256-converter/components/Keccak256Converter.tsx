"use client";

import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { keccakId } from "thirdweb/utils";
import { ShareButton } from "../../components/share";

export const Keccak256Converter = () => {
  const [rawString, setRawString] = useState("MINTER_ROLE");
  const keccak256Hash = keccakId(rawString);

  return (
    <div className="space-y-24">
      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Label htmlFor="raw-string-input" className="min-w-64 text-xl">
            Input String
          </Label>
          <Input
            id="raw-string-input"
            value={rawString}
            onChange={(e) => setRawString(e.target.value)}
            className="p-6 text-xl"
          />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Label className="min-w-64 text-xl">Keccak-256 Hash</Label>
          <CopyTextButton
            textToShow={keccak256Hash}
            textToCopy={keccak256Hash}
            tooltip="Copy"
            copyIconPosition="right"
            className="overflow-auto font-mono text-xl"
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
            textToShow={`keccakId("${rawString}")`}
            textToCopy={`keccakId("${rawString}")`}
            tooltip="Copy"
            copyIconPosition="right"
            className="font-mono"
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
