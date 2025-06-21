"use client";

import { FormControl, Textarea } from "@chakra-ui/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ThirdwebContract } from "thirdweb";
import * as VoteExt from "thirdweb/extensions/vote";
import { useSendAndConfirmTransaction } from "thirdweb/react";
import { Button, FormErrorMessage, FormLabel } from "tw-components";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface VoteButtonProps {
  contract: ThirdwebContract;
  isLoggedIn: boolean;
}

const PROPOSAL_FORM_ID = "proposal-form-id";

export const ProposalButton: React.FC<VoteButtonProps> = ({
  contract,
  isLoggedIn,
}) => {
  const [open, setOpen] = useState(false);
  const sendTx = useSendAndConfirmTransaction();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ description: string }>();

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button
          colorScheme="primary"
          leftIcon={<PlusIcon className="size-5" />}
        >
          Create Proposal
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-[540px] sm:max-w-[90%] lg:w-[700px]">
        <SheetHeader>
          <SheetTitle>Create new proposal</SheetTitle>
        </SheetHeader>
        <form
          className="mt-10 flex flex-col gap-6"
          id={PROPOSAL_FORM_ID}
          onSubmit={handleSubmit((data) => {
            const tx = VoteExt.propose({
              calldatas: ["0x"],
              contract,
              description: data.description,
              targets: [contract.address],
              values: [0n],
            });
            toast.promise(
              sendTx.mutateAsync(tx, {
                onError: (error) => {
                  console.error(error);
                },
                onSuccess: () => {
                  setOpen(false);
                },
              }),
              {
                error: "Failed to create proposal",
                loading: "Creating proposal...",
                success: "Proposal created successfully",
              },
            );
          })}
        >
          <FormControl isInvalid={!!errors.description} isRequired>
            <FormLabel>Description</FormLabel>
            <Textarea {...register("description")} />
            <FormErrorMessage>{errors?.description?.message}</FormErrorMessage>
          </FormControl>
        </form>
        <div className="mt-6 flex flex-row justify-end gap-3">
          <Button
            isDisabled={sendTx.isPending}
            onClick={() => setOpen(false)}
            variant="outline"
          >
            Cancel
          </Button>
          <TransactionButton
            client={contract.client}
            form={PROPOSAL_FORM_ID}
            isLoggedIn={isLoggedIn}
            isPending={sendTx.isPending}
            transactionCount={1}
            txChainID={contract.chain.id}
            type="submit"
          >
            Submit
          </TransactionButton>
        </div>
      </SheetContent>
    </Sheet>
  );
};
