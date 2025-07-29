import { InfoIcon, PlusIcon, XIcon } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { type ThirdwebContract, ZERO_ADDRESS } from "thirdweb";
import { AdminOrSelfOnly } from "@/components/contracts/roles/admin-only";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const PermissionEditor = ({
  role,
  contract,
  isUserAdmin,
}: {
  role: string;
  contract: ThirdwebContract;
  isUserAdmin: boolean;
}) => {
  const form = useFormContext();
  const formFields = useFieldArray({
    control: form.control,
    name: role,
  });

  return (
    <div className="space-y-4">
      {formFields.fields.length === 0 && (
        <Alert variant="warning" className="bg-background">
          <InfoIcon className="size-5" />
          <AlertTitle>
            {role === "asset"
              ? "No asset contracts are permitted to be listed on this marketplace"
              : "Nobody has this permission for this contract"}
          </AlertTitle>
        </Alert>
      )}

      {formFields.fields.length > 0 && (
        <div className="space-y-3">
          {formFields.fields?.map((field, index) => (
            <PermissionAddress
              contract={contract}
              isSubmitting={form.formState.isSubmitting}
              key={field.id}
              member={form.watch(`${role}.${index}`)}
              removeAddress={() => formFields.remove(index)}
              role={role}
              index={index}
              isUserAdmin={isUserAdmin}
            />
          ))}

          {isUserAdmin && (
            <div className="flex">
              <Button
                variant="outline"
                onClick={() => formFields.append("")}
                size="sm"
                className="gap-2 rounded-full bg-background"
              >
                <PlusIcon className="size-3.5" />
                Add Address
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const PermissionAddress = ({
  member,
  removeAddress,
  isSubmitting,
  contract,
  index,
  role,
  isUserAdmin,
}: {
  role: string;
  member: string;
  removeAddress: () => void;
  isSubmitting: boolean;
  contract: ThirdwebContract;
  index: number;
  isUserAdmin: boolean;
}) => {
  const form = useFormContext();

  return (
    <div className="flex gap-3 max-w-xl">
      <Input
        {...form.register(`${role}.${index}`)}
        className="font-mono grow bg-background disabled:opacity-100"
        disabled={isSubmitting || !isUserAdmin}
        placeholder={ZERO_ADDRESS}
      />
      <AdminOrSelfOnly contract={contract} self={member}>
        <Button
          variant="outline"
          className="rounded-full size-10 p-0 bg-background shrink-0"
          onClick={removeAddress}
        >
          <XIcon className="size-4" />
        </Button>
      </AdminOrSelfOnly>
    </div>
  );
};
