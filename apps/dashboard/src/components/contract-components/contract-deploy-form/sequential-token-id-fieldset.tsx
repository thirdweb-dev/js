import { SolidityInput } from "contract-ui/components/solidity-inputs";
import type { UseFormRegisterReturn } from "react-hook-form";
import type { ThirdwebClient } from "thirdweb";
import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { FormControl } from "@/components/ui/form";

interface SequentialTokenIdFieldsetProps {
  isInvalid: boolean;
  register: UseFormRegisterReturn;
  errorMessage: string | undefined;
  client: ThirdwebClient;
}

export const SequentialTokenIdFieldset: React.FC<
  SequentialTokenIdFieldsetProps
> = (props) => {
  return (
    <FormFieldSetup
      errorMessage={props.errorMessage}
      helperText="The starting token ID for the NFT collection."
      htmlFor="startTokenId"
      isRequired={true}
      label="Start Token ID"
    >
      <FormControl>
        <SolidityInput
          solidityType="uint256"
          {...props.register}
          client={props.client}
        />
      </FormControl>
    </FormFieldSetup>
  );
};
