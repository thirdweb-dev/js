import { SolidityInputWithTypeProps } from ".";
import { validateInt } from "./helpers";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { parseEther } from "ethers/lib/utils";
import { useCallback } from "react";
import { Button } from "tw-components";

export const SolidityIntInput: React.FC<SolidityInputWithTypeProps> = ({
  formContext: form,
  solidityType,
  ...inputProps
}) => {
  const { name, ...restOfInputProps } = inputProps;
  const inputName = name as string;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    form.setValue(inputName, value, { shouldDirty: true });

    const inputError = validateInt(value, solidityType);

    if (inputError) {
      form.setError(inputName, inputError);
    } else {
      form.clearErrors(inputName);
    }
  };

  const handleConversion = useCallback(() => {
    const val: string = form.getValues(inputName);

    try {
      const parsed = parseEther(val.replace(",", "."));
      form.setValue(inputName, parsed.toString(), {
        shouldDirty: true,
        shouldValidate: true,
      });
      form.clearErrors(inputName);
    } catch (e) {
      form.setError(inputName, {
        type: "pattern",
        message: "Can't be converted to WEI.",
      });
    }
  }, [form, inputName]);

  const formValue = form.watch(inputName) || "";

  return (
    <InputGroup>
      <Input
        placeholder={solidityType}
        {...restOfInputProps}
        value={form.watch(inputName)}
        onChange={handleChange}
      />
      {(formValue.includes(".") || formValue.includes(",")) && (
        <InputRightElement width="auto" px={1}>
          <Button variant="ghost" size="sm" onClick={handleConversion}>
            Convert to WEI
          </Button>
        </InputRightElement>
      )}
    </InputGroup>
  );
};
