import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Icon } from "@chakra-ui/react";
import { useState } from "react";
import { FiDroplet } from "react-icons/fi";
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
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="z-[10000] lg:w-[700px] sm:w-[540px] sm:max-w-[90%]">
          <SheetHeader>
            <SheetTitle>Aidrop tokens</SheetTitle>
          </SheetHeader>
          <TokenAirdropForm contract={contract} />
        </SheetContent>
      </Sheet>
      <Button
        colorScheme="primary"
        leftIcon={<Icon as={FiDroplet} />}
        {...restButtonProps}
        onClick={() => setOpen(true)}
        isDisabled={!hasBalance}
      >
        Airdrop
      </Button>
    </>
  );
};
