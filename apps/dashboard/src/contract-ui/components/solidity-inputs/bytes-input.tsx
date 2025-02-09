import { Input } from "@chakra-ui/react";
import { validateBytes } from "./helpers";
import type { SolidityInputWithTypeProps } from "./index";

export const SolidityBytesInput: React.FC<SolidityInputWithTypeProps> = ({
  formContext: form,
  solidityType,
  ...inputProps
}) => {
  // discard size prop to fix type
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { name, size, ...restOfInputProps } = inputProps;
  const inputName = name as string;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    form.setValue(inputName, value, { shouldDirty: true });

    const inputError = validateBytes(value, solidityType);

    if (inputError) {
      form.setError(inputName, inputError);
    } else {
      form.clearErrors(inputName);
    }
  };

  return (
    <Input
      placeholder={solidityType}
      {...restOfInputProps}
      value={form.watch(inputName)}
      onChange={handleChange}
    />
  );
};
