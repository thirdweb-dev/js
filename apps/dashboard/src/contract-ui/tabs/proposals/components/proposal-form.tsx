import {
  FormControl,
  Stack,
  Textarea,
  useModalContext,
} from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ThirdwebContract } from "thirdweb";
import * as VoteExt from "thirdweb/extensions/vote";
import type { useSendAndConfirmTransaction } from "thirdweb/react";
import { FormErrorMessage, FormLabel } from "tw-components";

interface ProposalFormProps {
  sendTx: ReturnType<typeof useSendAndConfirmTransaction>;
  contract: ThirdwebContract;
  formId: string;
}

export const CreateProposalForm: React.FC<ProposalFormProps> = ({
  sendTx,
  formId,
  contract,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ description: string }>();
  const trackEvent = useTrack();
  const modalContext = useModalContext();

  return (
    <Stack
      spacing={6}
      as="form"
      id={formId}
      onSubmit={handleSubmit((data) => {
        const tx = VoteExt.propose({
          contract,
          calldatas: ["0x"],
          values: [0n],
          targets: [contract.address],
          description: data.description,
        });
        toast.promise(
          sendTx.mutateAsync(tx, {
            onSuccess: () => {
              trackEvent({
                category: "vote",
                action: "create-proposal",
                label: "success",
              });
              modalContext.onClose();
            },
            onError: (error) => {
              trackEvent({
                category: "vote",
                action: "create-proposal",
                label: "error",
                error,
              });
            },
          }),
          {
            loading: "Creating proposal...",
            success: "Proposal created successfully",
            error: "Failed to create proposal",
          },
        );
      })}
    >
      <FormControl isRequired isInvalid={!!errors.description}>
        <FormLabel>Description</FormLabel>
        <Textarea {...register("description")} />
        <FormErrorMessage>{errors?.description?.message}</FormErrorMessage>
      </FormControl>
    </Stack>
  );
};
