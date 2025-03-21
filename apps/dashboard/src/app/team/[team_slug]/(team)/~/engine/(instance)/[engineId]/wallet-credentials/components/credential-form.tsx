import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { Spinner } from "@/components/ui/Spinner/Spinner";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import { Dialog } from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
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
      type: "circle" as CredentialType,
      label: "",
      ...defaultValues,
    },
    mode: "onChange",
  });

  const selectedType = form.watch("type");

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
                  <TrackedLinkTW
                    href="https://portal.thirdweb.com/engine/features/wallet-credentials"
                    target="_blank"
                    label="learn-more"
                    category="engine"
                    className="text-link-foreground hover:text-foreground"
                  >
                    Learn more about wallet credentials
                  </TrackedLinkTW>
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-5">
                {/* Type */}
                {!hideTypeSelect && (
                  <FormFieldSetup
                    label="Type"
                    errorMessage={
                      form.getFieldState("type", form.formState).error?.message
                    }
                    htmlFor="credential-type"
                    isRequired
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
                  label="Label"
                  errorMessage={
                    form.getFieldState("label", form.formState).error?.message
                  }
                  htmlFor="credential-label"
                  isRequired
                  tooltip={null}
                >
                  <Input
                    id="credential-label"
                    type="text"
                    placeholder="A description to identify this credential"
                    className="bg-card"
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
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="min-w-28 gap-2"
                disabled={!form.formState.isValid || isPending}
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
