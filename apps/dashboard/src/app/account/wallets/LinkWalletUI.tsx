"use client";

import { WalletAddress } from "@/components/blocks/wallet-address";
import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { SearchInput } from "../components/SearchInput";

export function LinkWalletUI(props: {
  wallets: string[];
}) {
  const [searchValue, setSearchValue] = useState("");
  const walletsToShow = !searchValue
    ? props.wallets
    : props.wallets.filter((v) => {
        return v.toLowerCase().includes(searchValue.toLowerCase());
      });

  return (
    <div>
      <div className="flex flex-col items-start gap-4 lg:flex-row lg:justify-between">
        <div>
          <h2 className="mb-0.5 font-semibold text-xl tracking-tight">
            Linked Wallets
          </h2>
          <p className="text-muted-foreground text-sm">
            The wallets that are linked to your thirdweb account
          </p>
        </div>

        {/* TODO - handle linking */}
        <Button variant="primary" className="gap-2 max-sm:w-full">
          <PlusIcon className="size-4" />
          Link a Wallet
        </Button>
      </div>

      <div className="h-4" />

      <SearchInput
        placeholder="Search wallet address"
        value={searchValue}
        onValueChange={setSearchValue}
      />

      <div className="h-4" />

      <ul className="rounded-lg border bg-card">
        {walletsToShow.map((v) => {
          return (
            <li key={v} className="border-border border-b p-4 last:border-b-0">
              <WalletRow address={v} />
            </li>
          );
        })}

        {/* No Result Found */}
        {walletsToShow.length === 0 && (
          <div className="flex h-[200px] items-center justify-center p-4">
            <div className="flex flex-col gap-3 text-center">
              <p className="text-sm">No Wallets Found</p>
              {searchValue && (
                <p className="text-muted-foreground text-sm">
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
    <div className="flex items-center justify-between gap-2">
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
