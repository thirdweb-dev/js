import {
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  FormControl,
  Input,
  Select,
  useModalContext,
} from "@chakra-ui/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useForm } from "react-hook-form";
import type { ThirdwebContract } from "thirdweb";
import { type BatchToReveal, reveal } from "thirdweb/extensions/erc721";
import { useSendAndConfirmTransaction } from "thirdweb/react";
import { FormErrorMessage, FormLabel, Heading } from "tw-components";

const REVEAL_FORM_ID = "reveal-form";

interface NFTRevealFormProps {
  contract: ThirdwebContract;
  batchesToReveal: BatchToReveal[];
}

export const NFTRevealForm: React.FC<NFTRevealFormProps> = ({
  contract,
  batchesToReveal,
}) => {
  const trackEvent = useTrack();

  const sendTxMutation = useSendAndConfirmTransaction();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<{ batchId: string; password: string }>();
  const modalContext = useModalContext();

  const { onSuccess, onError } = useTxNotifications(
    "Batch revealed successfully",
    "Error revealing batch upload",
    contract,
  );

  return (
    <>
      <DrawerHeader>
        <Heading>Reveal batch</Heading>
      </DrawerHeader>
      <DrawerBody>
        <form
          className="flex flex-col gap-6"
          id={REVEAL_FORM_ID}
          onSubmit={handleSubmit((data) => {
            trackEvent({
              category: "nft",
              action: "batch-upload-reveal",
              label: "attempt",
            });

            const tx = reveal({
              contract,
              batchId: BigInt(data.batchId),
              password: data.password,
            });

            sendTxMutation.mutate(tx, {
              onSuccess: () => {
                trackEvent({
                  category: "nft",
                  action: "batch-upload-reveal",
                  label: "success",
                });
                onSuccess();
                modalContext.onClose();
              },
              onError: (error) => {
                trackEvent({
                  category: "nft",
                  action: "batch-upload-reveal",
                  label: "error",
                });
                onError(error);
              },
            });
          })}
        >
          <FormControl isRequired isInvalid={!!errors.password} mr={4}>
            <FormLabel>Select a batch</FormLabel>
            <Select {...register("batchId")} autoFocus>
              {batchesToReveal.map((batch) => (
                <option
                  key={batch.batchId.toString()}
                  value={batch.batchId.toString()}
                >
                  {batch.placeholderMetadata?.name || batch.batchId.toString()}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={!!errors.password} mr={4}>
            <FormLabel>Password</FormLabel>
            <Input
              {...register("password")}
              autoFocus
              placeholder="The one you used to upload this batch"
              type="password"
            />
            <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
          </FormControl>
        </form>
      </DrawerBody>
      <DrawerFooter>
        <TransactionButton
          transactionCount={1}
          isLoading={sendTxMutation.isPending}
          form={REVEAL_FORM_ID}
          type="submit"
          colorScheme="primary"
          isDisabled={!isDirty}
        >
          Reveal NFTs
        </TransactionButton>
      </DrawerFooter>
    </>
  );
};
