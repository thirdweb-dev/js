"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { FormControl, Textarea } from "@chakra-ui/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTrack } from "hooks/analytics/useTrack";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ThirdwebContract } from "thirdweb";
import * as VoteExt from "thirdweb/extensions/vote";
import { useSendAndConfirmTransaction } from "thirdweb/react";
import { Button, FormErrorMessage, FormLabel } from "tw-components";

interface VoteButtonProps {
  contract: ThirdwebContract;
  twAccount: Account | undefined;
}

const PROPOSAL_FORM_ID = "proposal-form-id";

export const ProposalButton: React.FC<VoteButtonProps> = ({
  contract,
  twAccount,
}) => {
  const [open, setOpen] = useState(false);
  const sendTx = useSendAndConfirmTransaction();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ description: string }>();
  const trackEvent = useTrack();
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          colorScheme="primary"
          leftIcon={<PlusIcon className="size-5" />}
        >
          Create Proposal
        </Button>
      </SheetTrigger>
      <SheetContent className="z-[10000] w-full sm:w-[540px] sm:max-w-[90%] lg:w-[700px]">
        <SheetHeader>
          <SheetTitle>Create new proposal</SheetTitle>
        </SheetHeader>
        <form
          className="mt-10 flex flex-col gap-6"
          id={PROPOSAL_FORM_ID}
          onSubmit={handleSubmit((data) => {
            const tx = VoteExt.propose({
              contract,
              calldatas: ["0x"],
              values: [0n],
              targets: [contract.address],
              description: data.description,
            });
            toast.promise(
              sendTx.mutateAsync(tx, {
                onSuccess: () => {
                  trackEvent({
                    category: "vote",
                    action: "create-proposal",
                    label: "success",
                  });
                  setOpen(false);
                },
                onError: (error) => {
                  console.error(error);
                  trackEvent({
                    category: "vote",
                    action: "create-proposal",
                    label: "error",
                    error,
                  });
                },
              }),
              {
                loading: "Creating proposal...",
                success: "Proposal created successfully",
                error: "Failed to create proposal",
              },
            );
          })}
        >
          <FormControl isRequired isInvalid={!!errors.description}>
            <FormLabel>Description</FormLabel>
            <Textarea {...register("description")} />
            <FormErrorMessage>{errors?.description?.message}</FormErrorMessage>
          </FormControl>
        </form>
        <div className="mt-6 flex flex-row justify-end gap-3">
          <Button
            isDisabled={sendTx.isPending}
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <TransactionButton
            twAccount={twAccount}
            txChainID={contract.chain.id}
            transactionCount={1}
            isPending={sendTx.isPending}
            form={PROPOSAL_FORM_ID}
            type="submit"
          >
            Submit
          </TransactionButton>
        </div>
      </SheetContent>
    </Sheet>
  );
};
