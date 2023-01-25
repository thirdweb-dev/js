import { FormControl, Input, Stack } from "@chakra-ui/react";
import { NFTContract, useTransferNFT } from "@thirdweb-dev/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { detectFeatures } from "components/contract-components/utils";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { constants } from "ethers";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useForm } from "react-hook-form";
import { FormErrorMessage, FormHelperText, FormLabel } from "tw-components";

interface TransferTabProps {
  contract: NFTContract;
  tokenId: string;
}

const TransferTab: React.FC<TransferTabProps> = ({ contract, tokenId }) => {
  const trackEvent = useTrack();
  const form = useForm<{ to: string; amount: string }>({
    defaultValues: { to: "", amount: "1" },
  });

  const transfer = useTransferNFT(contract);

  const { onSuccess, onError } = useTxNotifications(
    "Transfer successful",
    "Error transferring",
  );

  const isErc1155 = detectFeatures(contract, ["ERC1155"]);

  return (
    <Stack pt={3}>
      <form
        onSubmit={form.handleSubmit((data) => {
          trackEvent({
            category: "nft",
            action: "transfer",
            label: "attempt",
          });
          transfer.mutate(
            {
              tokenId,
              to: data.to,
              amount: data.amount,
            },
            {
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
            },
          );
        })}
      >
        <Stack gap={3}>
          <Stack spacing={6} w="100%" direction={{ base: "column", md: "row" }}>
            <FormControl isRequired isInvalid={!!form.formState.errors.to}>
              <FormLabel>To Address</FormLabel>
              <SolidityInput
                solidityType="address"
                formContext={form}
                placeholder={constants.AddressZero}
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
            isLoading={transfer.isLoading}
            type="submit"
            colorScheme="primary"
            alignSelf="flex-end"
            isDisabled={!form.formState.isDirty}
          >
            Transfer
          </TransactionButton>
        </Stack>
      </form>
    </Stack>
  );
};

export default TransferTab;
