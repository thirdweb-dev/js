"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTrack } from "hooks/analytics/useTrack";
import { UploadIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ThirdwebContract } from "thirdweb";
import { multicall } from "thirdweb/extensions/common";
import { balanceOf, encodeSafeTransferFrom } from "thirdweb/extensions/erc1155";
import { useActiveAccount, useSendAndConfirmTransaction } from "thirdweb/react";
import {
  type AirdropAddressInput,
  AirdropUpload,
} from "../../../tokens/components/airdrop-upload";

interface AirdropTabProps {
  contract: ThirdwebContract;
  tokenId: string;
}

/**
 * This component must only take in ERC1155 contracts
 */
const AirdropTab: React.FC<AirdropTabProps> = ({ contract, tokenId }) => {
  const address = useActiveAccount()?.address;
  const { handleSubmit, setValue, watch, reset } = useForm<{
    addresses: AirdropAddressInput[];
  }>({
    defaultValues: { addresses: [] },
  });
  const trackEvent = useTrack();
  const sendAndConfirmTx = useSendAndConfirmTransaction();
  const addresses = watch("addresses");
  const [open, setOpen] = useState(false);

  return (
    <div className="flex w-full flex-col gap-2">
      <form
        onSubmit={handleSubmit(async (_data) => {
          try {
            trackEvent({
              category: "nft",
              action: "airdrop",
              label: "attempt",
              contract_address: contract.address,
              token_id: tokenId,
            });
            const totalOwned = await balanceOf({
              contract,
              tokenId: BigInt(tokenId),
              owner: address ?? "",
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
                from: address ?? "",
                to,
                value: BigInt(quantity),
                data: "0x",
                tokenId: BigInt(tokenId),
              }),
            );
            const transaction = multicall({ contract, data });
            const promise = sendAndConfirmTx.mutateAsync(transaction, {
              onSuccess: () => {
                trackEvent({
                  category: "nft",
                  action: "airdrop",
                  label: "success",
                  contract_address: contract.address,
                  token_id: tokenId,
                });
                reset();
              },
              onError: (error) => {
                trackEvent({
                  category: "nft",
                  action: "airdrop",
                  label: "success",
                  contract_address: contract.address,
                  token_id: tokenId,
                  error,
                });
              },
            });
            toast.promise(promise, {
              loading: "Airdropping NFTs",
              success: "Airdropped successfully",
              error: "Failed to airdrop",
            });
          } catch (err) {
            console.error(err);
            toast.error("Failed to airdrop NFTs");
          }
        })}
      >
        <div className="flex flex-col gap-2">
          <div className="mb-3 flex w-full flex-col gap-4 md:flex-row">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="primary" className="gap-2">
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
                  onClose={() => setOpen(false)}
                  setAirdrop={(value) =>
                    setValue("addresses", value, { shouldDirty: true })
                  }
                />
              </SheetContent>
            </Sheet>

            <div
              className={cn("flex flex-row items-center justify-center gap-2", {
                "text-orange-500": addresses.length === 0,
                "text-green-500": addresses.length > 0,
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
            txChainID={contract.chain.id}
            transactionCount={1}
            isPending={sendAndConfirmTx.isPending}
            type="submit"
            disabled={!!address && addresses.length === 0}
            className="self-end"
          >
            Airdrop
          </TransactionButton>
        </div>
      </form>
    </div>
  );
};
export default AirdropTab;
