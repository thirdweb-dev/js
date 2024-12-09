import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { Checkbox, CheckboxWithLabel } from "@/components/ui/checkbox";
import { InlineCode } from "@/components/ui/inline-code";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { FormControl, useBreakpointValue } from "@chakra-ui/react";
import type { AbiParameter } from "abitype";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { camelToTitle } from "contract-ui/components/solidity-inputs/helpers";
import { getTemplateValuesForType } from "lib/deployment/template-values";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { DecodedInputArrayFieldset } from "./decoded-bytes-input/decoded-input-array-fieldset";
import { RefInputFieldset } from "./ref-contract-input/ref-input-fieldset";

interface ContractParamsFieldsetProps {
  deployParams: readonly AbiParameter[];
}
export const ContractParamsFieldset: React.FC<ContractParamsFieldsetProps> = ({
  deployParams,
}) => {
  const form = useFormContext();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const [isCustomInputEnabledArray, setIsCustomInputEnabledArray] = useState(
    Array(deployParams.length).fill(false),
  );

  const handleCustomInputEnabledArrayChange = (
    index: number,
    newValue: boolean,
  ) => {
    const newIsCustomInputEnabledArray = [...isCustomInputEnabledArray];
    newIsCustomInputEnabledArray[index] = newValue;
    setIsCustomInputEnabledArray(newIsCustomInputEnabledArray);

    if (newValue) {
      form.setValue(
        `constructorParams.${deployParams[index]?.name || "*"}.defaultValue`,
        "",
        {
          shouldDirty: true,
        },
      );

      form.setValue(
        `constructorParams.${deployParams[index]?.name || "*"}.dynamicValue.type`,
        deployParams[index]?.type,
      );
    } else {
      form.setValue(
        `constructorParams.${deployParams[index]?.name || "*"}.dynamicValue.type`,
        "",
      );
      form.setValue(
        `constructorParams.${deployParams[index]?.name || "*"}.dynamicValue`,
        "",
        {
          shouldDirty: true,
        },
      );
    }
  };

  return (
    <fieldset>
      <h2 className="font-semibold text-3xl tracking-tight">
        Contract Parameters
      </h2>
      <p className="text-muted-foreground">
        These are the parameters users will need to fill in when deploying this
        contract.
      </p>

      <div className="h-6" />

      <div className="flex flex-col gap-8">
        {deployParams.map((param, idx) => {
          const paramTemplateValues = getTemplateValuesForType(param.type);
          return (
            <div
              key={`implementation_${param.name}`}
              className="rounded-lg border border-border bg-muted/50 p-6"
            >
              {/* Title + Type */}
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-xl tracking-tight">
                  {param.name ? (
                    param.name
                  ) : (
                    <span className="italic">
                      Unnamed param (will not be used)
                    </span>
                  )}
                </h3>
                <InlineCode
                  className="px-2 text-base text-muted-foreground"
                  code={param.type}
                />
              </div>

              <div className="h-5" />

              {/* Display Name */}
              <FormFieldSetup
                htmlFor="display-name"
                isRequired={false}
                label="Display Name"
                errorMessage={
                  form.getFieldState(
                    `constructorParams.${
                      param.name ? param.name : "*"
                    }.displayName`,
                    form.formState,
                  ).error?.message
                }
              >
                <Input
                  id="display-name"
                  value={form.watch(
                    `constructorParams.${
                      param.name ? param.name : "*"
                    }.displayName`,
                  )}
                  onChange={(e) =>
                    form.setValue(
                      `constructorParams.${
                        param.name ? param.name : "*"
                      }.displayName`,
                      e.target.value,
                    )
                  }
                  placeholder={camelToTitle(param.name ? param.name : "*")}
                />
              </FormFieldSetup>

              <div className="h-5" />

              {/* Description */}
              <FormFieldSetup
                isRequired={false}
                label="Description"
                errorMessage={
                  form.getFieldState(
                    `constructorParams.${
                      param.name ? param.name : "*"
                    }.description`,
                    form.formState,
                  ).error?.message
                }
                htmlFor="description"
                helperText={
                  <>
                    {form.watch(
                      `constructorParams.${
                        param.name ? param.name : "*"
                      }.description`,
                    )?.length ?? 0}
                    /400 characters
                  </>
                }
              >
                <Textarea
                  id="description"
                  value={form.watch(
                    `constructorParams.${
                      param.name ? param.name : "*"
                    }.description`,
                  )}
                  onChange={(e) =>
                    form.setValue(
                      `constructorParams.${
                        param.name ? param.name : "*"
                      }.description`,
                      e.target.value,
                    )
                  }
                  className="h-full"
                  maxLength={400}
                  placeholder="Enter a description for this parameter."
                />
              </FormFieldSetup>

              <Separator className="my-6" />

              {/* Default Value */}
              <div className="flex flex-col gap-5">
                {/* Title + Description + Switch */}
                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
                  <div>
                    <h4 className="font-medium text-base"> Default Value </h4>
                    <p className="text-muted-foreground text-sm">
                      Value prefilled in deployment form
                    </p>
                  </div>
                  {(param.type === "address" ||
                    param.type === "address[]" ||
                    param.type === "bytes" ||
                    param.type === "bytes[]") && (
                    <div className="flex items-center gap-3 text-sm">
                      Dynamic Input
                      <Switch
                        checked={isCustomInputEnabledArray[idx]}
                        onCheckedChange={(v) =>
                          handleCustomInputEnabledArrayChange(idx, v)
                        }
                      />
                    </div>
                  )}
                </div>

                {/* Inputs */}
                {!isCustomInputEnabledArray[idx] ? (
                  <FormControl>
                    <SolidityInput
                      className="!bg-background !text-sm placeholder:!text-sm"
                      solidityType={param.type}
                      placeholder={
                        isMobile ||
                        paramTemplateValues?.[0]?.value ===
                          "{{trusted_forwarders}}"
                          ? "Pre-filled value."
                          : "This value will be pre-filled in the deploy form."
                      }
                      {...form.register(
                        `constructorParams.${
                          param.name ? param.name : "*"
                        }.defaultValue`,
                      )}
                    />
                  </FormControl>
                ) : param.type === "address" || param.type === "address[]" ? (
                  <RefInputFieldset param={param} />
                ) : (
                  <DecodedInputArrayFieldset param={param} />
                )}

                {/* Checkboxes */}
                {paramTemplateValues.length > 0 &&
                  !isCustomInputEnabledArray[idx] &&
                  paramTemplateValues[0]?.helperText && (
                    <CheckboxWithLabel className="text-foreground">
                      <Checkbox
                        checked={
                          form.watch(
                            `constructorParams.${
                              param.name ? param.name : "*"
                            }.defaultValue`,
                          ) === paramTemplateValues[0]?.value
                        }
                        onCheckedChange={(v) => {
                          form.setValue(
                            `constructorParams.${
                              param.name ? param.name : "*"
                            }.defaultValue`,
                            v ? paramTemplateValues[0]?.value : "",
                            {
                              shouldDirty: true,
                            },
                          );
                        }}
                      />
                      {paramTemplateValues[0]?.helperText}
                    </CheckboxWithLabel>
                  )}

                {form.watch(
                  `constructorParams.${
                    param.name ? param.name : "*"
                  }.defaultValue`,
                ) && (
                  <CheckboxWithLabel>
                    <Checkbox
                      {...form.register(
                        `constructorParams.${
                          param.name ? param.name : "*"
                        }.hidden`,
                      )}
                      onCheckedChange={(v) => {
                        form.setValue(
                          `constructorParams.${
                            param.name ? param.name : "*"
                          }.hidden`,
                          !!v,
                        );
                      }}
                    />

                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">
                        Advanced Parameter
                      </span>
                      <span>
                        This parameter will be in the collapsed advanced
                        section.
                      </span>
                    </div>
                  </CheckboxWithLabel>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
};
