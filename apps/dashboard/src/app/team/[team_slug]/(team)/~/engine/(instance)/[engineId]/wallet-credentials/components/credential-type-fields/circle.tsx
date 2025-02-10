import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import type { UseFormReturn } from "react-hook-form";
import type { CredentialFormData, CredentialUpdateFormData } from "../types";

interface CircleCredentialFieldsProps {
  form: UseFormReturn<CredentialFormData | CredentialUpdateFormData>;
  isUpdate?: boolean;
}

export const CircleCredentialFields: React.FC<CircleCredentialFieldsProps> = ({
  form,
  isUpdate = false,
}) => {
  return (
    <>
      <FormFieldSetup
        label="Entity Secret"
        errorMessage={
          form.getFieldState("entitySecret", form.formState).error?.message
        }
        htmlFor="entity-secret"
        isRequired={!isUpdate}
        tooltip={null}
        helperText={
          <>
            Entity Secret is a 32-byte private key designed to secure your
            Developer-Controlled wallets{" "}
            <Link
              href="https://developers.circle.com/w3s/entity-secret-management"
              target="_blank"
              className="text-link-foreground hover:text-foreground"
            >
              Learn more about entity secret management
            </Link>
          </>
        }
      >
        <Input
          id="entity-secret"
          type="password"
          className="bg-card"
          placeholder={
            isUpdate
              ? "Leave empty to keep existing secret"
              : "Your Circle entity secret"
          }
          {...form.register("entitySecret", {
            required: !isUpdate,
            pattern: {
              value: /^([0-9a-fA-F]{64})?$/,
              message:
                "Entity secret must be a 32-byte hex string (64 characters)",
            },
            setValueAs: (value: string) => (value === "" ? undefined : value),
          })}
        />
      </FormFieldSetup>
    </>
  );
};
