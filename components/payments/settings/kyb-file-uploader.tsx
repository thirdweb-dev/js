import { usePaymentsUploadKybFiles } from "@3rdweb-sdk/react/hooks/usePayments";
import { Flex, Icon } from "@chakra-ui/react";
import { FileInput } from "components/shared/FileInput";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useFieldArray, useForm } from "react-hook-form";
import { FiX } from "react-icons/fi";
import { Button, Card, Text } from "tw-components";

type FileWithId = {
  id: string;
  file: File;
};

export const KybFileUploader: React.FC = () => {
  const form = useForm<{ files: FileWithId[] }>();
  const { fields, append, remove } = useFieldArray({
    name: "files",
    control: form.control,
  });
  const { mutate: uploadKybFiles, isLoading } = usePaymentsUploadKybFiles();
  const trackEvent = useTrack();

  const { onSuccess, onError } = useTxNotifications(
    "Successfully uploaded files.",
    "Failed to upload files.",
  );

  return (
    <Flex
      as="form"
      gap={2}
      flexDir="column"
      onSubmit={form.handleSubmit((data) => {
        trackEvent({
          category: "payments",
          action: "upload-kyb-files",
          label: "attempt",
        });
        uploadKybFiles(
          {
            files: data.files.map((file) => file.file),
          },
          {
            onSuccess: () => {
              onSuccess();
              trackEvent({
                category: "payments",
                action: "upload-kyb-files",
                label: "success",
              });
              form.reset();
            },
            onError: (error) => {
              onError(error);
              trackEvent({
                category: "payments",
                action: "upload-kyb-files",
                label: "error",
                error,
              });
            },
          },
        );
      })}
    >
      <FileInput
        accept={{ "image/*": [], "application/pdf": [] }}
        setValue={(file) => append({ id: `${file.name}-${Date.now()}`, file })}
        transition="all 200ms ease"
        _hover={{ shadow: "sm" }}
        helperText="Document"
        selectOrUpload="Upload"
        showUploadButton
        showPreview={false}
      />
      <Flex flexDir="column" gap={2}>
        {(form.watch("files") || []).length > 0 &&
          fields.map((field, idx) => (
            <Card
              key={idx}
              py={1}
              borderRadius="md"
              as={Flex}
              justifyContent="space-between"
              alignItems="center"
            >
              <Text>{field.file.name}</Text>
              <Icon
                boxSize={5}
                cursor="pointer"
                as={FiX}
                onClick={() => {
                  remove(idx);
                }}
                _hover={{
                  opacity: 0.5,
                }}
              />
            </Card>
          ))}
      </Flex>

      {form.watch("files")?.length > 0 && (
        <Flex justifyContent="flex-end">
          <Button
            type="submit"
            colorScheme="primary"
            isDisabled={
              !form.watch("files") || form.watch("files").length === 0
            }
            isLoading={isLoading}
          >
            Submit for Review
          </Button>
        </Flex>
      )}
    </Flex>
  );
};
