"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { DropletIcon } from "lucide-react";
import { useState } from "react";
import type { ThirdwebContract } from "thirdweb";
import { balanceOf } from "thirdweb/extensions/erc20";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { TokenAirdropForm } from "./airdrop-form";

interface TokenAirdropButtonProps {
  contract: ThirdwebContract;
  twAccount: Account | undefined;
}

export const TokenAirdropButton: React.FC<TokenAirdropButtonProps> = ({
  contract,
  twAccount,
  ...restButtonProps
}) => {
  const address = useActiveAccount()?.address;
  const tokenBalanceQuery = useReadContract(balanceOf, {
    contract,
    address: address || "",
    queryOptions: { enabled: !!address },
  });
  const hasBalance = tokenBalanceQuery.data && tokenBalanceQuery.data > 0n;
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="primary"
          {...restButtonProps}
          disabled={!hasBalance}
          className="gap-2"
        >
          <DropletIcon size={16} /> Airdrop
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full overflow-y-auto sm:min-w-[540px] lg:min-w-[700px]">
        <SheetHeader>
          <SheetTitle className="text-left">Airdrop tokens</SheetTitle>
        </SheetHeader>
        <TokenAirdropForm
          contract={contract}
          toggle={setOpen}
          twAccount={twAccount}
        />
      </SheetContent>
    </Sheet>
  );
};
