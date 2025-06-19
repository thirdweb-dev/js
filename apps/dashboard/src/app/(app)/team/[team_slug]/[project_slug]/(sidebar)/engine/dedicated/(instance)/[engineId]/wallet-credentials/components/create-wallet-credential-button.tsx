import { Button } from "@/components/ui/button";
import { useEngineCreateWalletCredential } from "@3rdweb-sdk/react/hooks/useEngine";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CredentialForm } from "./credential-form";
import type { CredentialFormData } from "./types";

interface CreateWalletCredentialButtonProps {
  instanceUrl: string;
  authToken: string;
}

export const CreateWalletCredentialButton: React.FC<
  CreateWalletCredentialButtonProps
> = ({ instanceUrl, authToken }) => {
  const [isOpen, setIsOpen] = useState(false);

  const createCredential = useEngineCreateWalletCredential({
    instanceUrl,
    authToken,
  });

  const handleSubmit = async (data: CredentialFormData) => {
    const promise = createCredential.mutateAsync(data);

    toast.promise(promise, {
      success: () => {
        setIsOpen(false);
        return "Wallet credential created successfully";
      },
      error: (error) => {
        console.error(error);
        return "Failed to create wallet credential";
      },
    });
  };

  return (
    <>
      <Button
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <PlusIcon className="mr-2 h-4 w-4" />
        Create Wallet Credential
      </Button>

      <CredentialForm
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onSubmit={async (data) => handleSubmit(data as CredentialFormData)}
        title="Create Wallet Credential"
        submitButtonText="Create"
        isPending={createCredential.isPending}
      />
    </>
  );
};
