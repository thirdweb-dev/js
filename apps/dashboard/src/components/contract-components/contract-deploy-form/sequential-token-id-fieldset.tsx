import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { FormControl } from "@/components/ui/form";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import type { UseFormRegisterReturn } from "react-hook-form";

interface SequentialTokenIdFieldsetProps {
  isInvalid: boolean;
  register: UseFormRegisterReturn;
  errorMessage: string | undefined;
}

export const SequentialTokenIdFieldset: React.FC<
  SequentialTokenIdFieldsetProps
> = (props) => {
  return (
    <FormFieldSetup
      htmlFor="startTokenId"
      label="Start Token ID"
      isRequired={true}
      errorMessage={props.errorMessage}
      helperText="The starting token ID for the NFT collection."
    >
      <FormControl>
        <SolidityInput
          solidityType="uint256"
          variant="filled"
          {...props.register}
        />
      </FormControl>
    </FormFieldSetup>
  );
};
