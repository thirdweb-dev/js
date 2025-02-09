import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileInput } from "components/shared/FileInput";
import { useImageFileOrUrl } from "hooks/useImageFileOrUrl";
import { Fieldset } from "./common";
import type { CustomContractDeploymentForm } from "./custom-contract";

interface ContractMetadataFieldsetProps {
  form: CustomContractDeploymentForm;
}

export const ContractMetadataFieldset: React.FC<
  ContractMetadataFieldsetProps
> = ({ form }) => {
  return (
    <Fieldset legend="Contract Metadata">
      <div className="flex flex-col gap-6 md:grid md:grid-cols-[200px_1fr]">
        <FormFieldSetup
          errorMessage={
            form.getFieldState("contractMetadata.image", form.formState).error
              ?.message
          }
          label="Image"
          isRequired={false}
        >
          <FileInput
            accept={{ "image/*": [] }}
            value={useImageFileOrUrl(form.watch("contractMetadata.image"))}
            setValue={(file) =>
              form.setValue("contractMetadata.image", file, {
                shouldTouch: true,
              })
            }
            className="rounded border-border bg-background transition-all duration-200 hover:border-active-border hover:bg-background"
          />
        </FormFieldSetup>

        <div className="flex flex-col gap-6">
          {/* name + symbol */}
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-4">
            <FormFieldSetup
              className="grow"
              label="Name"
              isRequired
              htmlFor="contractMetadata-name"
              errorMessage={
                form.getFieldState("contractMetadata.name", form.formState)
                  .error?.message
              }
            >
              <Input
                id="contractMetadata-name"
                {...form.register("contractMetadata.name", {
                  required: "Name is Required",
                })}
              />
            </FormFieldSetup>

            <FormFieldSetup
              className="lg:max-w-[300px]"
              isRequired={false}
              label="Symbol"
              htmlFor="contractMetadata-symbol"
              errorMessage={
                form.getFieldState("contractMetadata.symbol", form.formState)
                  .error?.message
              }
            >
              <Input
                {...form.register("contractMetadata.symbol")}
                id="contractMetadata-symbol"
              />
            </FormFieldSetup>
          </div>

          <FormFieldSetup
            className="flex grow flex-col"
            label="Description"
            isRequired={false}
            htmlFor="contractMetadata-description"
            errorMessage={
              form.getFieldState("contractMetadata.description", form.formState)
                .error?.message
            }
          >
            <Textarea
              {...form.register("contractMetadata.description")}
              className="grow"
              id="contractMetadata-description"
            />
          </FormFieldSetup>
        </div>
      </div>
    </Fieldset>
  );
};
