import { Dialog } from "@radix-ui/react-dialog";
import Link from "next/link";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/Spinner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CircleCredentialFields } from "./credential-type-fields/circle";
import {
  CREDENTIAL_TYPE_OPTIONS,
  type CredentialFormData,
  type CredentialType,
  type CredentialUpdateFormData,
} from "./types";

interface CredentialFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    data: CredentialFormData | CredentialUpdateFormData,
  ) => Promise<void>;
  title: string;
  submitButtonText: string;
  isPending: boolean;
  defaultValues?: Partial<CredentialFormData | CredentialUpdateFormData>;
  hideTypeSelect?: boolean;
  isUpdate?: boolean;
}

export const CredentialForm = ({
  isOpen,
  onOpenChange,
  onSubmit,
  title,
  submitButtonText,
  isPending,
  defaultValues,
  hideTypeSelect = false,
  isUpdate = false,
}: CredentialFormProps) => {
  const form = useForm<CredentialFormData | CredentialUpdateFormData>({
    defaultValues: {
      label: "",
      type: "circle" as CredentialType,
      ...defaultValues,
    },
    mode: "onChange",
  });

  const selectedType = form.watch("type");
  const credentialLabelId = useId();
  return (
    <Dialog onOpenChange={onOpenChange} open={isOpen}>
      <DialogContent className="overflow-hidden p-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => {
              return onSubmit(data);
            })}
          >
            <div className="p-6">
              <DialogHeader className="mb-4">
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>
                  <Link
                    className="text-link-foreground hover:text-foreground"
                    href="https://portal.thirdweb.com/engine/features/wallet-credentials"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Learn more about wallet credentials
                  </Link>
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-5">
                {/* Type */}
                {!hideTypeSelect && (
                  <FormFieldSetup
                    errorMessage={
                      form.getFieldState("type", form.formState).error?.message
                    }
                    htmlFor="credential-type"
                    isRequired
                    label="Type"
                    tooltip={null}
                  >
                    <Select
                      onValueChange={(value) =>
                        form.setValue("type", value as CredentialType)
                      }
                      value={form.watch("type")}
                    >
                      <SelectTrigger className="bg-card">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {CREDENTIAL_TYPE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormFieldSetup>
                )}

                {/* Label */}
                <FormFieldSetup
                  errorMessage={
                    form.getFieldState("label", form.formState).error?.message
                  }
                  htmlFor={credentialLabelId}
                  isRequired
                  label="Label"
                  tooltip={null}
                >
                  <Input
                    className="bg-card"
                    id={credentialLabelId}
                    placeholder="A description to identify this credential"
                    type="text"
                    {...form.register("label", { required: true })}
                  />
                </FormFieldSetup>

                {/* Type-specific fields */}
                {selectedType === "circle" && (
                  <CircleCredentialFields form={form} isUpdate={isUpdate} />
                )}
              </div>
            </div>

            <DialogFooter className="mt-4 gap-4 border-border border-t bg-card p-6 lg:gap-2">
              <Button onClick={() => onOpenChange(false)} variant="outline">
                Cancel
              </Button>
              <Button
                className="min-w-28 gap-2"
                disabled={!form.formState.isValid || isPending}
                type="submit"
              >
                {isPending && <Spinner className="size-4" />}
                {submitButtonText}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
