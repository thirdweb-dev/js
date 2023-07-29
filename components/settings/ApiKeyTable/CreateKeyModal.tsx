import { ApiKeyKeyForm } from "./KeyForm";
import { ApiKeyValidationSchema } from "./validations";
import { ApiKey } from "@3rdweb-sdk/react/hooks/useApi";
import { Modal, ModalOverlay } from "@chakra-ui/react";
import { UseFormReturn } from "react-hook-form";

interface ApiKeysCreateModalProps {
  apiKey?: ApiKey | null;
  open: boolean;
  form?: UseFormReturn<ApiKeyValidationSchema, any>;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit?: () => void;
}

export const ApiKeysCreateModal: React.FC<ApiKeysCreateModalProps> = ({
  open,
  apiKey,
  form,
  isLoading,
  onClose,
  onSubmit,
}) => {
  const renderCreateForm = () => {
    if (form && onSubmit) {
      return (
        <ApiKeyKeyForm
          form={form}
          onSubmit={onSubmit}
          onClose={onClose}
          apiKey={apiKey}
          isLoading={isLoading}
          tabbed={false}
        />
      );
    }
    return null;
  };

  return (
    <Modal isOpen={open} onClose={apiKey ? () => undefined : onClose} size="xl">
      <ModalOverlay />
      {renderCreateForm()}
    </Modal>
  );
};
