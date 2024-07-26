"use client";

import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { type Hex, fromHex, toHex } from "thirdweb";
import { ShareButton } from "../../components/share";

export const HexConverter = () => {
  const [hex, setHex] = useState("0x64");
  const [dec, setDec] = useState(100);

  const onChange = (args: { hex?: string; dec?: number }) => {
    try {
      if (args.hex && /^0x[0-9a-fA-F]*$/.test(args.hex)) {
        setHex(args.hex);
        setDec(fromHex(args.hex as Hex, "number"));
      } else if (args.dec !== undefined) {
        setHex(toHex(args.dec));
        setDec(args.dec);
      }
    } catch (e) {}
  };

  return (
    <div className="space-y-24">
      <div className="space-y-4">
        <div className="flex gap-2 sm:items-center flex-col sm:flex-row">
          <Label htmlFor="hex-input" className="min-w-60 text-xl">
            Hex
          </Label>
          <Input
            id="hex-input"
            value={hex}
            onChange={(e) => onChange({ hex: e.target.value })}
            className="text-xl p-6"
          />
        </div>
        <div className="flex gap-2 sm:items-center flex-col sm:flex-row">
          <Label htmlFor="dec-input" className="min-w-60 text-xl">
            Decimal
          </Label>
          <Input
            id="dec-input"
            type="number"
            value={dec}
            onChange={(e) => onChange({ dec: e.target.valueAsNumber })}
            className="text-xl p-6"
          />
        </div>
        <div className="flex justify-end mt-4">
          <ShareButton
            cta="Share on X"
            href="https://twitter.com/intent/tweet?text=Easy-to-use%20hex%20converter%20by%20thirdweb%20%F0%9F%98%8D&url=https%3A%2F%2Fthirdweb.com%2Ftools%2Fhex-converter"
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
            textToShow={`fromHex("${hex}", "number")`}
            textToCopy={`fromHex("${hex}", "number")`}
            tooltip="Copy"
            copyIconPosition="right"
          />
        </div>
        <div>
          <CopyTextButton
            textToShow={`toHex(${dec})`}
            textToCopy={`toHex(${dec})`}
            tooltip="Copy"
            copyIconPosition="right"
          />
        </div>
      </Card>

      <div className="space-y-4">
        <h1 className="text-2xl font-bold">
          Convert between hexadecimal and decimal units
        </h1>
        <p>
          Hexadecimal (base 16) is preferred in the Ethereum Virtual Machine
          (EVM) for its:
        </p>
        <h2 className="text-md font-bold">Compactness</h2>
        <p>
          Each hex digit represents 4 bits, making it concise for large binary
          numbers.
        </p>
        <h2 className="text-md font-bold">Alignment</h2>
        <p>
          Hex aligns with binary computing, aiding data representation and
          processing.
        </p>
        <h2 className="text-md font-bold">Standard</h2>
        <p>
          Widely used in programming and cryptography for simplicity with binary
          data.
        </p>
        <h2 className="text-md font-bold">Length</h2>
        <p>
          Ensures consistent string lengths, crucial for Ethereum addresses and
          hashes.
        </p>
        <h2 className="text-md font-bold">Conversion</h2>
        <p>
          Straightforward mapping to binary facilitates error-free conversions.
        </p>
      </div>
    </div>
  );
};
