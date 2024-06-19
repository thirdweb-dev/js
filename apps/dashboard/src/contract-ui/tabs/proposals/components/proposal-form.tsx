import {
  IProposalInput,
  useProposalCreateMutation,
} from "@3rdweb-sdk/react/hooks/useVote";
import {
  FormControl,
  Stack,
  Textarea,
  useModalContext,
} from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useForm } from "react-hook-form";
import { FormErrorMessage, FormLabel } from "tw-components";

interface ProposalFormProps {
  propose: ReturnType<typeof useProposalCreateMutation>;
  formId: string;
}

export const CreateProposalForm: React.FC<ProposalFormProps> = ({
  propose,
  formId,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IProposalInput>();
  const trackEvent = useTrack();

  const modalContext = useModalContext();

  const { onSuccess, onError } = useTxNotifications(
    "Proposal successfully created",
    "Failed to create proposal",
  );

  return (
    <Stack
      spacing={6}
      as="form"
      id={formId}
      onSubmit={handleSubmit((data) => {
        propose.mutate(data, {
          onSuccess: () => {
            onSuccess();
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
            onError(error);
          },
        });
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
