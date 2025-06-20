import Link from "next/link";
import { useId } from "react";
import type { UseFormReturn } from "react-hook-form";
import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { Input } from "@/components/ui/input";
import type { CredentialFormData, CredentialUpdateFormData } from "../types";

interface CircleCredentialFieldsProps {
  form: UseFormReturn<CredentialFormData | CredentialUpdateFormData>;
  isUpdate?: boolean;
}

export const CircleCredentialFields: React.FC<CircleCredentialFieldsProps> = ({
  form,
  isUpdate = false,
}) => {
  const entitySecretId = useId();

  return (
    <>
      <FormFieldSetup
        errorMessage={
          form.getFieldState("entitySecret", form.formState).error?.message
        }
        helperText={
          <>
            Entity Secret is a 32-byte private key designed to secure your
            Developer-Controlled wallets{" "}
            <Link
              className="text-link-foreground hover:text-foreground"
              href="https://developers.circle.com/w3s/entity-secret-management"
              rel="noopener noreferrer"
              target="_blank"
            >
              Learn more about entity secret management
            </Link>
          </>
        }
        htmlFor={entitySecretId}
        isRequired={!isUpdate}
        label="Entity Secret"
        tooltip={null}
      >
        <Input
          className="bg-card"
          id={entitySecretId}
          placeholder={
            isUpdate
              ? "Leave empty to keep existing secret"
              : "Your Circle entity secret"
          }
          type="password"
          {...form.register("entitySecret", {
            pattern: {
              message:
                "Entity secret must be a 32-byte hex string (64 characters)",
              value: /^([0-9a-fA-F]{64})?$/,
            },
            required: !isUpdate,
            setValueAs: (value: string) => (value === "" ? undefined : value),
          })}
        />
      </FormFieldSetup>
    </>
  );
};
