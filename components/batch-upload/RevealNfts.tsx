import { useNFTDropRevealMutation } from "@3rdweb-sdk/react";
import {
  FormControl,
  FormErrorMessage,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import { BatchToReveal, NFTDrop } from "@thirdweb-dev/sdk";
import { TransactionButton } from "components/buttons/TransactionButton";
import React from "react";
import { useForm } from "react-hook-form";
import { parseErrorToMessage } from "utils/errorParser";

interface RevealNftsModalProps {
  contract?: NFTDrop;
  isOpen: boolean;
  onClose: () => void;
  batch: BatchToReveal;
}

export const RevealNftsModal: React.FC<RevealNftsModalProps> = ({
  isOpen,
  onClose,
  contract,
  batch,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const reveal = useNFTDropRevealMutation(contract);

  const toast = useToast();

  const onSuccess = (): void => {
    toast({
      title: "Success",
      description: "Batch revealed successfully",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    onClose();
  };

  // TODO FIXME
  const onSubmit = (data: any) => {
    reveal.mutate(
      {
        batchId: batch.batchId,
        password: data.password,
      },
      {
        onSuccess,
        onError: (error) => {
          toast({
            title: "Error revealing batch upload",
            description: parseErrorToMessage(error),
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        },
      },
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>
          Reveal Password for {batch?.placeholderMetadata?.name}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isRequired isInvalid={!!errors.password} mr={4}>
            <Input
              {...register("password")}
              placeholder="Password you previously used to batch upload"
              type="password"
            />
            <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <TransactionButton
            mt={4}
            size="md"
            colorScheme="primary"
            transactionCount={1}
            type="submit"
            isLoading={reveal.isLoading}
            loadingText="Revealing NFTs..."
          >
            Reveal NFTs
          </TransactionButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
