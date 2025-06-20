"use client";

import { useId, useState } from "react";
import { fromHex, type Hex, toHex } from "thirdweb";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    } catch {}
  };

  const hexInputId = useId();
  const decInputId = useId();

  return (
    <div className="space-y-24">
      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Label className="min-w-60 text-xl" htmlFor={hexInputId}>
            Hex
          </Label>
          <Input
            className="p-6 text-xl"
            id={hexInputId}
            onChange={(e) => onChange({ hex: e.target.value })}
            value={hex}
          />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Label className="min-w-60 text-xl" htmlFor={decInputId}>
            Decimal
          </Label>
          <Input
            className="p-6 text-xl"
            id={decInputId}
            onChange={(e) => onChange({ dec: e.target.valueAsNumber })}
            type="number"
            value={dec}
          />
        </div>
        <div className="mt-4 flex justify-end">
          <ShareButton
            cta="Share on X"
            href="https://twitter.com/intent/tweet?text=Easy-to-use%20hex%20converter%20by%20thirdweb%20%F0%9F%98%8D&url=https%3A%2F%2Fthirdweb.com%2Ftools%2Fhex-converter"
          />
        </div>
      </div>

      <Card className="flex flex-col gap-2 p-4">
        <p>
          Or use the
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
            textToCopy={`fromHex("${hex}", "number")`}
            textToShow={`fromHex("${hex}", "number")`}
            tooltip="Copy"
          />
        </div>
        <div>
          <CopyTextButton
            copyIconPosition="right"
            textToCopy={`toHex(${dec})`}
            textToShow={`toHex(${dec})`}
            tooltip="Copy"
          />
        </div>
      </Card>

      <div className="space-y-4">
        <h1 className="font-bold text-2xl">
          Convert between hexadecimal and decimal units
        </h1>
        <p>
          Hexadecimal (base 16) is preferred in the Ethereum Virtual Machine
          (EVM) for its:
        </p>
        <h2 className="font-bold text-md">Compactness</h2>
        <p>
          Each hex digit represents 4 bits, making it concise for large binary
          numbers.
        </p>
        <h2 className="font-bold text-md">Alignment</h2>
        <p>
          Hex aligns with binary computing, aiding data representation and
          processing.
        </p>
        <h2 className="font-bold text-md">Standard</h2>
        <p>
          Widely used in programming and cryptography for simplicity with binary
          data.
        </p>
        <h2 className="font-bold text-md">Length</h2>
        <p>
          Ensures consistent string lengths, crucial for Ethereum addresses and
          hashes.
        </p>
        <h2 className="font-bold text-md">Conversion</h2>
        <p>
          Straightforward mapping to binary facilitates error-free conversions.
        </p>
      </div>
    </div>
  );
};
