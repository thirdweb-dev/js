"use client";

import { WalletAddress } from "@/components/blocks/wallet-address";
import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { SearchInput } from "../components/SearchInput";

export function LinkWalletUI(props: {
  wallets: string[];
}) {
  const [searchValue, setSerchValue] = useState("");
  const walletsToShow = !searchValue
    ? props.wallets
    : props.wallets.filter((v) => {
        return v.toLowerCase().includes(searchValue.toLowerCase());
      });

  return (
    <div>
      <div className="flex items-start gap-4 flex-col lg:flex-row lg:justify-between">
        <div>
          <h2 className="font-semibold text-xl tracking-tight mb-0.5">
            Linked Wallets
          </h2>
          <p className="text-muted-foreground text-sm">
            The wallets that are linked to your thirdweb account
          </p>
        </div>

        {/* TODO - handle linking */}
        <Button variant="primary" className="max-sm:w-full gap-2">
          <PlusIcon className="size-4" />
          Link a Wallet
        </Button>
      </div>

      <div className="h-4" />

      <SearchInput
        placeholder="Search wallet address"
        value={searchValue}
        onValueChange={setSerchValue}
      />

      <div className="h-4" />

      <ul className="bg-muted/50 border rounded-lg">
        {walletsToShow.map((v) => {
          return (
            <li key={v} className="border-b border-border p-4 last:border-b-0">
              <WalletRow address={v} />
            </li>
          );
        })}

        {/* No Result Found */}
        {walletsToShow.length === 0 && (
          <div className="p-4 h-[200px] justify-center flex items-center">
            <div className="text-center flex flex-col gap-3">
              <p className="text-sm">No Wallets Found</p>
              {searchValue && (
                <p className="text-sm text-muted-foreground">
                  Your search for {`"${searchValue}"`} did not match any wallets
                </p>
              )}
            </div>
          </div>
        )}
      </ul>
    </div>
  );
}

function WalletRow(props: {
  address: string;
}) {
  return (
    <div className="flex gap-2 items-center justify-between">
      {/* start */}
      <WalletAddress
        address={props.address}
        className="text-muted-foreground"
      />

      {/* end */}
      {/* TODO - handle unlink */}
      <Button size="sm" variant="outline" className="gap-2">
        <MinusIcon className="size-4" />
        Unlink
      </Button>
    </div>
  );
}
