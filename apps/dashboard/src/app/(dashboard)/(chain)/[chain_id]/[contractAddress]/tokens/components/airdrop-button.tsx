"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Droplet } from "lucide-react";
import { useState } from "react";
import type { ThirdwebContract } from "thirdweb";
import { balanceOf } from "thirdweb/extensions/erc20";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { Button } from "tw-components";
import { TokenAirdropForm } from "./airdrop-form";
interface TokenAirdropButtonProps {
  contract: ThirdwebContract;
}
export const TokenAirdropButton: React.FC<TokenAirdropButtonProps> = ({
  contract,
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
          colorScheme="primary"
          leftIcon={<Droplet size={16} />}
          {...restButtonProps}
          isDisabled={!hasBalance}
        >
          Airdrop
        </Button>
      </SheetTrigger>
      <SheetContent className="z-[10000] overflow-y-auto sm:w-[540px] sm:max-w-[90%] lg:w-[700px]">
        <SheetHeader>
          <SheetTitle>Aidrop tokens</SheetTitle>
        </SheetHeader>
        <TokenAirdropForm contract={contract} toggle={setOpen} />
      </SheetContent>
    </Sheet>
  );
};
