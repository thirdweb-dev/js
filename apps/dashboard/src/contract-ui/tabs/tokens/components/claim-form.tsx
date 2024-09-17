import {
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  FormControl,
  Input,
  Stack,
  useModalContext,
} from "@chakra-ui/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type ThirdwebContract, ZERO_ADDRESS } from "thirdweb";
import {
  claimTo,
  decimals,
  getApprovalForTransaction,
} from "thirdweb/extensions/erc20";
import {
  useActiveAccount,
  useReadContract,
  useSendAndConfirmTransaction,
} from "thirdweb/react";
import {
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
} from "tw-components";

const CLAIM_FORM_ID = "token-claim-form";
interface TokenClaimFormProps {
  contract: ThirdwebContract;
}

export const TokenClaimForm: React.FC<TokenClaimFormProps> = ({ contract }) => {
  const trackEvent = useTrack();
  const address = useActiveAccount()?.address;
  const { register, handleSubmit, formState } = useForm({
    defaultValues: { amount: "0", to: address },
  });
  const modalContext = useModalContext();
  const { errors, isDirty } = formState;
  const txNotifications = useTxNotifications(
    "Tokens claimed successfully",
    "Failed to claim tokens",
    contract,
  );

  const { data: _decimals, isLoading } = useReadContract(decimals, {
    contract,
  });
  const sendAndConfirmTx = useSendAndConfirmTransaction();
  const account = useActiveAccount();

  return (
    <>
      <DrawerHeader>
        <Heading>Claim tokens</Heading>
      </DrawerHeader>
      <DrawerBody>
        <Stack gap={3} as="form">
          <Stack spacing={6} w="100%" direction={{ base: "column", md: "row" }}>
            <FormControl isRequired isInvalid={!!errors.to}>
              <FormLabel>To Address</FormLabel>
              <Input
                placeholder={ZERO_ADDRESS}
                {...register("to", { required: true })}
              />
              <FormHelperText>Enter the address to claim to.</FormHelperText>
              <FormErrorMessage>{errors.to?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={!!errors.amount}>
              <FormLabel>Amount</FormLabel>
              <Input
                type="text"
                pattern={`^\\d+(\\.\\d{1,${_decimals || 18}})?$`}
                {...register("amount", { required: true })}
              />
              <FormHelperText>How many would you like to claim?</FormHelperText>
              <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
            </FormControl>
          </Stack>
        </Stack>
      </DrawerBody>
      <DrawerFooter>
        <TransactionButton
          transactionCount={1}
          form={CLAIM_FORM_ID}
          isLoading={formState.isSubmitting}
          type="submit"
          colorScheme="primary"
          isDisabled={!isDirty || isLoading}
          onClick={handleSubmit(async (d) => {
            if (d.to) {
              trackEvent({
                category: "token",
                action: "claim",
                label: "attempt",
              });
              if (!account) {
                return toast.error("No account detected");
              }
              try {
                const transaction = claimTo({
                  contract,
                  to: d.to,
                  quantity: d.amount,
                  from: account.address,
                });

                const approveTx = await getApprovalForTransaction({
                  transaction,
                  account,
                });

                if (approveTx) {
                  try {
                    await sendAndConfirmTx.mutateAsync(approveTx);
                  } catch {
                    return toast.error("Error approving ERC20 token");
                  }
                }

                await sendAndConfirmTx.mutateAsync(transaction);

                trackEvent({
                  category: "token",
                  action: "claim",
                  label: "success",
                });
                txNotifications.onSuccess();
                modalContext.onClose();
              } catch (error) {
                trackEvent({
                  category: "token",
                  action: "claim",
                  label: "error",
                  error,
                });
                txNotifications.onError(error);
              }
            }
          })}
        >
          Claim Tokens
        </TransactionButton>
      </DrawerFooter>
    </>
  );
};
