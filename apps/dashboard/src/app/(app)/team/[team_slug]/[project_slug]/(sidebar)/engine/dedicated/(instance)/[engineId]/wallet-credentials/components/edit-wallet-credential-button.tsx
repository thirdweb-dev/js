import {
  useEngineUpdateWalletCredential,
  type WalletCredential,
} from "@3rdweb-sdk/react/hooks/useEngine";
import { PencilIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CredentialForm } from "./credential-form";
import type { CredentialUpdateFormData } from "./types";

interface EditWalletCredentialButtonProps {
  credential: WalletCredential;
  instanceUrl: string;
  authToken: string;
}

export const EditWalletCredentialButton: React.FC<
  EditWalletCredentialButtonProps
> = ({ credential, instanceUrl, authToken }) => {
  const [isOpen, setIsOpen] = useState(false);

  const updateCredential = useEngineUpdateWalletCredential({
    authToken,
    instanceUrl,
  });

  const handleSubmit = async (data: CredentialUpdateFormData) => {
    const promise = updateCredential.mutateAsync({
      id: credential.id,
      ...data,
    });

    toast.promise(promise, {
      error: (error) => {
        console.log(error);
        console.error(error);
        return "Failed to update wallet credential";
      },
      success: () => {
        setIsOpen(false);

        return "Wallet credential updated successfully";
      },
    });
  };

  return (
    <>
      <Button
        className="size-8"
        onClick={() => {
          setIsOpen(true);
        }}
        size="icon"
        variant="ghost"
      >
        <PencilIcon className="size-4" />
      </Button>

      <CredentialForm
        defaultValues={{
          label: credential.label || "",
          type: credential.type as "circle",
        }}
        hideTypeSelect
        isOpen={isOpen}
        isPending={updateCredential.isPending}
        isUpdate
        onOpenChange={setIsOpen}
        onSubmit={async (data) => {
          return new Promise<void>((resolve) => {
            handleSubmit(data as CredentialUpdateFormData).then(resolve);
          });
        }}
        submitButtonText="Save Changes"
        title="Edit Wallet Credential"
      />
    </>
  );
};
