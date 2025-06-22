import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useEngineCreateWalletCredential } from "@/hooks/useEngine";
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
    authToken,
    instanceUrl,
  });

  const handleSubmit = async (data: CredentialFormData) => {
    const promise = createCredential.mutateAsync(data);

    toast.promise(promise, {
      error: (error) => {
        console.error(error);
        return "Failed to create wallet credential";
      },
      success: () => {
        setIsOpen(false);
        return "Wallet credential created successfully";
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
        isPending={createCredential.isPending}
        onOpenChange={setIsOpen}
        onSubmit={async (data) => handleSubmit(data as CredentialFormData)}
        submitButtonText="Create"
        title="Create Wallet Credential"
      />
    </>
  );
};
