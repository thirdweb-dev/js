import {
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  FormControl,
  Input,
  Stack,
  useModalContext,
} from "@chakra-ui/react";
import { DropContract, useAddress, useClaimNFT } from "@thirdweb-dev/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { constants } from "ethers";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useForm } from "react-hook-form";
import {
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
} from "tw-components";

const CLAIM_FORM_ID = "nft-claim-form";
interface NFTClaimFormProps {
  contract: DropContract;
}

export const NFTClaimForm: React.FC<NFTClaimFormProps> = ({ contract }) => {
  const trackEvent = useTrack();
  const claim = useClaimNFT(contract);
  const address = useAddress();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { amount: "1", to: address } });
  const modalContext = useModalContext();

  const { onSuccess, onError } = useTxNotifications(
    "Successfully claimed NFTs",
    "Failed to claim NFT",
  );

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
              <Input placeholder={constants.AddressZero} {...register("to")} />
              <FormHelperText>Enter the address to claim to.</FormHelperText>
              <FormErrorMessage>{errors.to?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={!!errors.amount}>
              <FormLabel>Amount</FormLabel>
              <Input type="text" {...register("amount")} />
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
          isLoading={claim.isLoading}
          type="submit"
          colorScheme="primary"
          onClick={handleSubmit((d) => {
            trackEvent({
              category: "nft",
              action: "claim",
              label: "attempt",
            });
            claim.mutate(
              { quantity: d.amount, to: d.to },
              {
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
              },
            );
          })}
        >
          Claim NFT
        </TransactionButton>
      </DrawerFooter>
    </>
  );
};
