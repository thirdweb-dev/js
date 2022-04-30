import { IMintFormProps } from "./types";
import {
  IProposalInput,
  useProposalCreateMutation,
} from "@3rdweb-sdk/react/hooks/useVote";
import {
  DrawerBody,
  DrawerFooter,
  FormControl,
  FormErrorMessage,
  Stack,
  Textarea,
  useModalContext,
} from "@chakra-ui/react";
import { Vote } from "@thirdweb-dev/sdk";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTxNotifications } from "hooks/useTxNotifications";
import React from "react";
import { useForm } from "react-hook-form";
import { Button, FormLabel } from "tw-components";

const MINT_FORM_ID = "proposal-mint-form";
interface IProposalMintForm extends IMintFormProps {
  contract: Vote;
}

export const ProposalMintForm: React.FC<IProposalMintForm> = ({ contract }) => {
  const propose = useProposalCreateMutation(contract?.getAddress());
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IProposalInput>();

  const modalContext = useModalContext();

  const { onSuccess, onError } = useTxNotifications(
    "Proposal successfully created",
    "Failed to create proposal",
  );

  return (
    <>
      <DrawerBody>
        <Stack
          spacing={6}
          as="form"
          id={MINT_FORM_ID}
          onSubmit={handleSubmit((data) => {
            propose.mutate(data, {
              onSuccess: () => {
                onSuccess();
                modalContext.onClose();
              },
              onError,
            });
          })}
        >
          <FormControl isRequired isInvalid={!!errors.description}>
            <FormLabel>Description</FormLabel>
            <Textarea {...register("description")} />
            <FormErrorMessage>{errors?.description?.message}</FormErrorMessage>
          </FormControl>
        </Stack>
      </DrawerBody>
      <DrawerFooter>
        <Button
          isDisabled={propose.isLoading}
          variant="outline"
          mr={3}
          onClick={modalContext.onClose}
        >
          Cancel
        </Button>
        <TransactionButton
          transactionCount={1}
          isLoading={propose.isLoading}
          form={MINT_FORM_ID}
          type="submit"
          colorScheme="primary"
        >
          Submit Proposal
        </TransactionButton>
      </DrawerFooter>
    </>
  );
};
