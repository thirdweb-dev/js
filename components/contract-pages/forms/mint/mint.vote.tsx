import { IMintFormProps } from "./types";
import { useProposalCreateMutation } from "@3rdweb-sdk/react/hooks/useVote";
import {
  DrawerBody,
  DrawerFooter,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Stack,
  Textarea,
  useModalContext,
  useToast,
} from "@chakra-ui/react";
import { Vote } from "@thirdweb-dev/sdk";
import { Button } from "components/buttons/Button";
import { MismatchButton } from "components/buttons/MismatchButton";
import React from "react";
import { useForm } from "react-hook-form";
import { FiPlus } from "react-icons/fi";
import { parseErrorToMessage } from "utils/errorParser";

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
  } = useForm();

  const modalContext = useModalContext();
  const toast = useToast();

  const onSuccess = () => {
    toast({
      title: "Success",
      description: "Proposal successfully created",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    modalContext.onClose();
  };

  const onError = (error: unknown) => {
    toast({
      title: "Error",
      description: parseErrorToMessage(error),
      status: "error",
      duration: 9000,
      isClosable: true,
    });
  };

  const onSubmit = (data: any) => {
    propose.mutate(data, { onSuccess, onError });
  };

  return (
    <>
      <DrawerBody>
        <Stack
          spacing={6}
          as="form"
          id={MINT_FORM_ID}
          onSubmit={handleSubmit(onSubmit)}
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
        <MismatchButton
          isLoading={propose.isLoading}
          leftIcon={<Icon as={FiPlus} />}
          form={MINT_FORM_ID}
          type="submit"
          colorScheme="primary"
        >
          Submit Proposal
        </MismatchButton>
      </DrawerFooter>
    </>
  );
};
