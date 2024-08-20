import { thirdwebClient } from "@/constants/client";
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
import { useV5DashboardChain } from "lib/v5-adapter";
import { useForm } from "react-hook-form";
import { ZERO_ADDRESS, getContract } from "thirdweb";
import { claimTo } from "thirdweb/extensions/erc721";
import { useActiveAccount, useSendAndConfirmTransaction } from "thirdweb/react";
import {
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
} from "tw-components";

const CLAIM_FORM_ID = "nft-claim-form";
interface NFTClaimFormProps {
  contractAddress: string;
  chainId: number;
}

export const NFTClaimForm: React.FC<NFTClaimFormProps> = ({
  contractAddress,
  chainId,
}) => {
  const chain = useV5DashboardChain(chainId);
  const contract = getContract({
    address: contractAddress,
    chain: chain,
    client: thirdwebClient,
  });
  const trackEvent = useTrack();
  const address = useActiveAccount()?.address;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { amount: "1", to: address } });
  const modalContext = useModalContext();

  const { onSuccess, onError } = useTxNotifications(
    "Successfully claimed NFTs",
    "Failed to claim NFT",
    contract,
  );
  const { mutate, isPending } = useSendAndConfirmTransaction();
  return (
    <>
      <DrawerHeader>
        <Heading>Claim NFTs</Heading>
      </DrawerHeader>
      <DrawerBody>
        <Stack gap={3} as="form">
          <Stack spacing={6} w="100%" direction={{ base: "column", md: "row" }}>
            <FormControl isRequired isInvalid={!!errors.to}>
              <FormLabel>To Address</FormLabel>
              <Input placeholder={ZERO_ADDRESS} {...register("to")} />
              <FormHelperText>Enter the address to claim to.</FormHelperText>
              <FormErrorMessage>{errors.to?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={!!errors.amount}>
              <FormLabel>Amount</FormLabel>
              <Input
                type="text"
                {...register("amount", {
                  validate: (value) => {
                    const valueNum = Number(value);
                    if (!Number.isInteger(valueNum)) {
                      return "Amount must be an integer";
                    }
                  },
                })}
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
          isLoading={isPending}
          type="submit"
          colorScheme="primary"
          onClick={handleSubmit((d) => {
            trackEvent({
              category: "nft",
              action: "claim",
              label: "attempt",
            });
            if (!d.to) {
              return onError(
                new Error("Please enter the address that will receive the NFT"),
              );
            }
            const transaction = claimTo({
              contract,
              to: d.to,
              quantity: BigInt(d.amount),
            });
            mutate(transaction, {
              onSuccess: () => {
                trackEvent({
                  category: "nft",
                  action: "claim",
                  label: "success",
                });
                onSuccess();
                modalContext.onClose();
              },
              onError: (error) => {
                trackEvent({
                  category: "nft",
                  action: "claim",
                  label: "error",
                  error,
                });
                onError(error);
              },
            });
          })}
        >
          Claim NFT
        </TransactionButton>
      </DrawerFooter>
    </>
  );
};
