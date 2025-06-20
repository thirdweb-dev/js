import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { camelToTitle } from "contract-ui/components/solidity-inputs/helpers";
import { useFormContext } from "react-hook-form";
import type { ThirdwebClient } from "thirdweb";
import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";

interface ParamProps {
  paramKey: string;
  isRequired: boolean;
  inputClassName?: string;
  client: ThirdwebClient;
  extraMetadataParam?: {
    displayName?: string;
    description?: string;
  };
  deployParam?: {
    type: string;
    name?: string;
  };
}

export const Param: React.FC<ParamProps> = ({
  paramKey,
  extraMetadataParam,
  deployParam,
  isRequired,
  inputClassName,
  client,
}) => {
  const form = useFormContext();

  if (!deployParam) {
    return null;
  }

  return (
    <FormFieldSetup
      className="relative"
      errorMessage={
        form.getFieldState(`deployParams.${paramKey}`, form.formState).error
          ?.message
      }
      helperText={extraMetadataParam?.description}
      isRequired={isRequired}
      key={paramKey}
      label={
        <span className="inline-flex gap-1 align-baseline">
          {extraMetadataParam?.displayName
            ? extraMetadataParam.displayName
            : paramKey === "*"
              ? "Unnamed"
              : camelToTitle(paramKey)}
          <span className="font-normal text-muted-foreground">
            ({paramKey})
          </span>
        </span>
      }
    >
      <span className="absolute top-0.5 right-0 text-muted-foreground text-sm">
        {deployParam.type}
      </span>
      <SolidityInput
        className={inputClassName}
        client={client}
        solidityType={deployParam.type}
        {...form.register(`deployParams.${paramKey}`)}
      />
    </FormFieldSetup>
  );
};
