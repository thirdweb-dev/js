import { FormControl, Input, Stack } from "@chakra-ui/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useForm } from "react-hook-form";
import { type ThirdwebContract, ZERO_ADDRESS } from "thirdweb";
import { transferFrom } from "thirdweb/extensions/erc721";
import { isERC1155, safeTransferFrom } from "thirdweb/extensions/erc1155";
import {
  useActiveAccount,
  useReadContract,
  useSendAndConfirmTransaction,
} from "thirdweb/react";
import { FormErrorMessage, FormHelperText, FormLabel } from "tw-components";
interface TransferTabProps {
  contract: ThirdwebContract;
  tokenId: string;
}

const TransferTab: React.FC<TransferTabProps> = ({ contract, tokenId }) => {
  const account = useActiveAccount();

  const trackEvent = useTrack();
  const form = useForm<{ to: string; amount: string }>({
    defaultValues: { to: "", amount: "1" },
  });

  const { onSuccess, onError } = useTxNotifications(
    "Transfer successful",
    "Error transferring",
    contract,
  );

  const { data: isErc1155, isLoading: checking1155 } = useReadContract(
    isERC1155,
    { contract },
  );

  const { mutate, isPending } = useSendAndConfirmTransaction();

  return (
    <Stack w="full">
      <form
        onSubmit={form.handleSubmit((data) => {
          trackEvent({
            category: "nft",
            action: "transfer",
            label: "attempt",
          });
          const transaction = isErc1155
            ? safeTransferFrom({
                contract,
                to: data.to,
                tokenId: BigInt(tokenId),
                value: BigInt(data.amount),
                data: "0x",
                from: account?.address ?? "",
              })
            : transferFrom({
                contract,
                to: data.to,
                tokenId: BigInt(tokenId),
                from: account?.address ?? "",
              });
          mutate(transaction, {
            onSuccess: () => {
              trackEvent({
                category: "nft",
                action: "transfer",
                label: "success",
              });
              onSuccess();
              form.reset();
            },
            onError: (error) => {
              trackEvent({
                category: "nft",
                action: "transfer",
                label: "error",
                error,
              });
              onError(error);
            },
          });
        })}
      >
        <Stack gap={3}>
          <Stack spacing={6} w="100%" direction={{ base: "column", md: "row" }}>
            <FormControl isRequired isInvalid={!!form.formState.errors.to}>
              <FormLabel>To Address</FormLabel>
              <SolidityInput
                solidityType="address"
                formContext={form}
                placeholder={ZERO_ADDRESS}
                {...form.register("to")}
              />
              <FormHelperText>Enter the address to transfer to.</FormHelperText>
              <FormErrorMessage>
                {form.formState.errors.to?.message}
              </FormErrorMessage>
            </FormControl>
            {isErc1155 && (
              <FormControl
                isRequired={isErc1155}
                isInvalid={!!form.formState.errors.to}
              >
                <FormLabel>Amount</FormLabel>
                <Input placeholder={"1"} {...form.register("amount")} />
                <FormHelperText>
                  How many would you like to transfer?
                </FormHelperText>
                <FormErrorMessage>
                  {form.formState.errors.to?.message}
                </FormErrorMessage>
              </FormControl>
            )}
          </Stack>
          <TransactionButton
            transactionCount={1}
            isLoading={isPending || checking1155}
            type="submit"
            colorScheme="primary"
            alignSelf="flex-end"
            isDisabled={
              !form.formState.isDirty || checking1155 || isPending || !account
            }
          >
            Transfer
          </TransactionButton>
        </Stack>
      </form>
    </Stack>
  );
};

export default TransferTab;
