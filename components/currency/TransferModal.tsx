import {
  useTokenBalance,
  useTransferMutation,
  useWeb3,
} from "@3rdweb-sdk/react";
import {
  Divider,
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useToken } from "@thirdweb-dev/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { useTxNotifications } from "hooks/useTxNotifications";
import React from "react";
import { useForm } from "react-hook-form";
import { FiSend } from "react-icons/fi";
import { FormLabel, Heading, Text } from "tw-components";

interface IMintModal {
  isOpen: boolean;
  onClose: () => void;
}

const FORM_ID = "TransferModal-form";

interface TransferModalFormValues {
  amount: string;
  to: string;
}

export const TransferModal: React.FC<IMintModal> = ({ isOpen, onClose }) => {
  const { address } = useWeb3();

  const tokenAddress = useSingleQueryParam("token");
  const contract = useToken(tokenAddress);

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TransferModalFormValues>({
    defaultValues: { to: address, amount: "0" },
  });

  const currentBalance = useTokenBalance(tokenAddress, watch("to"));

  const mutation = useTransferMutation(contract);

  const { onSuccess, onError } = useTxNotifications(
    "Transferred tokens successfully",
    "Failed to transfer tokens",
  );

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent mx={{ base: 4, md: 0 }}>
        <ModalHeader as={Heading}>Transfer Tokens</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={8}>
            <Stack>
              <form
                id={FORM_ID}
                onSubmit={handleSubmit((d) =>
                  mutation.mutate(
                    { to: d.to, amount: d.amount },
                    {
                      onSuccess,
                      onError,
                      onSettled: onClose,
                    },
                  ),
                )}
              >
                <Stack spacing={4}>
                  <FormControl isRequired isInvalid={!!errors.to}>
                    <Heading as={FormLabel} size="label.md">
                      To Address
                    </Heading>
                    <InputGroup>
                      <Input fontFamily="mono" {...register("to")} />
                    </InputGroup>
                    <FormErrorMessage>{errors?.to?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isRequired isInvalid={!!errors.amount}>
                    <Heading as={FormLabel} size="label.md">
                      Amount
                    </Heading>
                    <Input
                      fontFamily="mono"
                      step="any"
                      type="number"
                      {...register("amount")}
                    />
                    <FormErrorMessage>
                      {errors?.amount?.message}
                    </FormErrorMessage>
                  </FormControl>
                </Stack>
              </form>
            </Stack>
            <Divider />
            <Stack spacing={2} opacity={watch("to") ? 1 : 0.5}>
              <Table variant="simple">
                <TableCaption>Outcome of successful transfer</TableCaption>
                <Thead>
                  <Tr>
                    <Th isNumeric>
                      <Text as="label" size="label.md">
                        Current Balance
                      </Text>
                    </Th>
                    <Th isNumeric>
                      <Text as="label" size="label.md">
                        New Balance
                      </Text>
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td fontFamily="mono" isNumeric>
                      {currentBalance.data?.displayValue}
                    </Td>
                    <Td fontFamily="mono" isNumeric>
                      {watch("to")
                        ? parseFloat(currentBalance.data?.displayValue || "0") +
                          parseFloat(watch("amount"))
                        : 0}
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </Stack>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <TransactionButton
            transactionCount={1}
            isLoading={mutation.isLoading}
            type="submit"
            form={FORM_ID}
            colorScheme="primary"
            rightIcon={<FiSend />}
            isDisabled={!watch("to") || !watch("amount")}
          >
            Transfer
          </TransactionButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
