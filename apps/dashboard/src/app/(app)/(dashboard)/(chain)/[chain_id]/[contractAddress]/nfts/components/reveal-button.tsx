"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { MinterOnly } from "@3rdweb-sdk/react/components/roles/minter-only";
import { FormControl, Input, Select } from "@chakra-ui/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTrack } from "hooks/analytics/useTrack";
import { EyeIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ThirdwebContract } from "thirdweb";
import { getBatchesToReveal, reveal } from "thirdweb/extensions/erc721";
import { useReadContract, useSendAndConfirmTransaction } from "thirdweb/react";
import { FormErrorMessage, FormLabel } from "tw-components";

interface NFTRevealButtonProps {
  contract: ThirdwebContract;
  isLoggedIn: boolean;
}

const REVEAL_FORM_ID = "reveal-form";

export const NFTRevealButton: React.FC<NFTRevealButtonProps> = ({
  contract,
  isLoggedIn,
}) => {
  const batchesQuery = useReadContract(getBatchesToReveal, {
    contract,
  });
  const trackEvent = useTrack();

  const sendTxMutation = useSendAndConfirmTransaction();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<{ batchId: string; password: string }>();

  const [open, setOpen] = useState(false);

  if (!batchesQuery.data?.length) {
    return null;
  }

  /**
   * When a batch is revealed / decrypted / non-revealable, its batchUri will be "0x"
   */
  const allBatchesRevealed = batchesQuery.data.every(
    (o) => o.batchUri === "0x",
  );

  if (allBatchesRevealed) {
    return (
      <ToolTipLabel label="All batches are revealed">
        <Button variant="primary" className="gap-2" disabled>
          <EyeIcon className="size-4" /> Reveal NFTs
        </Button>
      </ToolTipLabel>
    );
  }

  return (
    <MinterOnly contract={contract}>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="primary" className="gap-2">
            <EyeIcon className="size-4" /> Reveal NFTs
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full overflow-y-auto sm:min-w-[540px] lg:min-w-[700px]">
          <SheetHeader>
            <SheetTitle className="text-left">Reveal batch</SheetTitle>
          </SheetHeader>
          <form
            className="mt-10 flex flex-col gap-6"
            id={REVEAL_FORM_ID}
            onSubmit={handleSubmit((data) => {
              trackEvent({
                category: "nft",
                action: "batch-upload-reveal",
                label: "attempt",
              });

              const tx = reveal({
                contract,
                batchId: BigInt(data.batchId),
                password: data.password,
              });

              const promise = sendTxMutation.mutateAsync(tx, {
                onSuccess: () => {
                  trackEvent({
                    category: "nft",
                    action: "batch-upload-reveal",
                    label: "success",
                  });
                  setOpen(false);
                },
                onError: (error) => {
                  console.error(error);
                  trackEvent({
                    category: "nft",
                    action: "batch-upload-reveal",
                    label: "error",
                  });
                },
              });

              toast.promise(promise, {
                loading: "Revealing batch",
                success: "Batch revealed successfully",
                error: "Failed to reveal batch",
              });
            })}
          >
            <FormControl isRequired isInvalid={!!errors.password} mr={4}>
              <FormLabel>Select a batch</FormLabel>
              <Select {...register("batchId")} autoFocus>
                {batchesQuery.data.map((batch) => (
                  <option
                    key={batch.batchId.toString()}
                    value={batch.batchId.toString()}
                    disabled={batch.batchUri === "0x"}
                  >
                    {batch.placeholderMetadata?.name ||
                      batch.batchId.toString()}{" "}
                    {batch.batchUri === "0x" && "(REVEALED)"}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={!!errors.password} mr={4}>
              <FormLabel>Password</FormLabel>
              <Input
                {...register("password")}
                autoFocus
                placeholder="The one you used to upload this batch"
                type="password"
              />
              <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
            </FormControl>
          </form>
          <div className="mt-4 flex justify-end">
            <TransactionButton
              client={contract.client}
              isLoggedIn={isLoggedIn}
              txChainID={contract.chain.id}
              transactionCount={1}
              isPending={sendTxMutation.isPending}
              form={REVEAL_FORM_ID}
              type="submit"
              disabled={!isDirty}
            >
              Reveal NFTs
            </TransactionButton>
          </div>
        </SheetContent>
      </Sheet>
    </MinterOnly>
  );
};
