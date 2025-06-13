import { Button } from "@/components/ui/button";
import {
  type WalletCredential,
  useEngineUpdateWalletCredential,
} from "@3rdweb-sdk/react/hooks/useEngine";
import { PencilIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
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
    instanceUrl,
    authToken,
  });

  const handleSubmit = async (data: CredentialUpdateFormData) => {
    const promise = updateCredential.mutateAsync({
      id: credential.id,
      ...data,
    });

    toast.promise(promise, {
      success: () => {
        setIsOpen(false);
        return "Wallet credential updated successfully";
      },
      error: (error) => {
        console.log(error);
        return "Failed to update wallet credential";
      },
    });
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          setIsOpen(true);
        }}
        className="size-8"
      >
        <PencilIcon className="size-4" />
      </Button>

      <CredentialForm
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onSubmit={async (data) => {
          return new Promise<void>((resolve) => {
            handleSubmit(data as CredentialUpdateFormData).then(resolve);
          });
        }}
        title="Edit Wallet Credential"
        submitButtonText="Save Changes"
        isPending={updateCredential.isPending}
        defaultValues={{
          type: credential.type as "circle",
          label: credential.label || "",
        }}
        hideTypeSelect
        isUpdate
      />
    </>
  );
};
