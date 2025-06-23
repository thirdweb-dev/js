"use client";

import { UploadIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ThirdwebContract } from "thirdweb";
import { multicall } from "thirdweb/extensions/common";
import { balanceOf, encodeSafeTransferFrom } from "thirdweb/extensions/erc1155";
import { useActiveAccount, useSendAndConfirmTransaction } from "thirdweb/react";
import { TransactionButton } from "@/components/tx-button";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useTxNotifications } from "@/hooks/useTxNotifications";
import { cn } from "@/lib/utils";
import {
  type AirdropAddressInput,
  AirdropUpload,
} from "../../../tokens/components/airdrop-upload";

interface AirdropTabProps {
  contract: ThirdwebContract;
  tokenId: string;
  isLoggedIn: boolean;
}

/**
 * This component must only take in ERC1155 contracts
 */
const AirdropTab: React.FC<AirdropTabProps> = ({
  contract,
  tokenId,
  isLoggedIn,
}) => {
  const address = useActiveAccount()?.address;
  const { handleSubmit, setValue, watch, reset } = useForm<{
    addresses: AirdropAddressInput[];
  }>({
    defaultValues: { addresses: [] },
  });
  const sendAndConfirmTx = useSendAndConfirmTransaction();
  const addresses = watch("addresses");
  const [open, setOpen] = useState(false);
  const airdropNotifications = useTxNotifications(
    "NFTs airdropped successfully",
    "Failed to airdrop NFTs",
  );

  return (
    <div className="flex w-full flex-col gap-2">
      <form
        onSubmit={handleSubmit(async (_data) => {
          try {
            const totalOwned = await balanceOf({
              contract,
              owner: address ?? "",
              tokenId: BigInt(tokenId),
            });
            // todo: make a batch-transfer extension for erc1155?
            const totalToAirdrop = _data.addresses.reduce((prev, curr) => {
              return BigInt(prev) + BigInt(curr?.quantity || 1);
            }, 0n);
            if (totalOwned < totalToAirdrop) {
              return toast.error(
                `The caller owns ${totalOwned.toString()} NFTs, but wants to airdrop ${totalToAirdrop.toString()} NFTs.`,
              );
            }
            const data = _data.addresses.map(({ address: to, quantity }) =>
              encodeSafeTransferFrom({
                data: "0x",
                from: address ?? "",
                to,
                tokenId: BigInt(tokenId),
                value: BigInt(quantity),
              }),
            );
            const transaction = multicall({ contract, data });
            await sendAndConfirmTx.mutateAsync(transaction, {
              onSuccess: () => {
                reset();
              },
            });

            airdropNotifications.onSuccess();
          } catch (err) {
            console.error(err);
            airdropNotifications.onError(err);
          }
        })}
      >
        <div className="flex flex-col gap-2">
          <div className="mb-3 flex w-full flex-col gap-4 md:flex-row">
            <Sheet onOpenChange={setOpen} open={open}>
              <SheetTrigger asChild>
                <Button className="gap-2" variant="primary">
                  Upload addresses <UploadIcon className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full overflow-y-auto sm:min-w-[540px] lg:min-w-[700px]">
                <SheetHeader>
                  <SheetTitle className="mb-5 text-left">
                    Airdrop NFTs
                  </SheetTitle>
                </SheetHeader>
                <AirdropUpload
                  client={contract.client}
                  onClose={() => setOpen(false)}
                  setAirdrop={(value) =>
                    setValue("addresses", value, { shouldDirty: true })
                  }
                />
              </SheetContent>
            </Sheet>

            <div
              className={cn("flex flex-row items-center justify-center gap-2", {
                "text-green-500": addresses.length > 0,
                "text-orange-500": addresses.length === 0,
              })}
            >
              {addresses.length > 0 && (
                <p>
                  ● <strong>{addresses.length} addresses</strong> ready to be
                  airdropped
                </p>
              )}
            </div>
          </div>
          <p>
            You can airdrop to a maximum of 250 addresses at a time. If you have
            more, please do it in multiple transactions.
          </p>
          <TransactionButton
            className="self-end"
            client={contract.client}
            disabled={!!address && addresses.length === 0}
            isLoggedIn={isLoggedIn}
            isPending={sendAndConfirmTx.isPending}
            transactionCount={1}
            txChainID={contract.chain.id}
            type="submit"
          >
            Airdrop
          </TransactionButton>
        </div>
      </form>
    </div>
  );
};
export default AirdropTab;
