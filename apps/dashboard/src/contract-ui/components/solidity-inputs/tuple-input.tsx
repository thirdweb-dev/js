import { Flex, Textarea, type TextareaProps } from "@chakra-ui/react";
import { FormHelperText } from "tw-components";
import type { SolidityInputWithTypeProps } from ".";
import { formatHint } from "./helpers";

export const SolidityTupleInput: React.FC<SolidityInputWithTypeProps> = ({
  formContext: form,
  solidityType,
  solidityComponents,
  ...inputProps
}) => {
  const { name, ...restOfInputProps } = inputProps;
  const inputName = name as string;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;

    form.setValue(inputName, value);

    const invalidInputError = {
      type: "pattern",
      message:
        "Invalid input. Input must be in JSON format and all the keys on the object should be present.",
    };

    const trimmedValue = value.trim();

    if (trimmedValue?.startsWith("{") && trimmedValue?.endsWith("}")) {
      try {
        const parsedValue = JSON.parse(trimmedValue);

        form.clearErrors(inputName);

        // TODO: Validate each component type
        const isValid = solidityComponents?.every((component) => {
          return component.name in parsedValue;
        });

        if (!isValid && solidityComponents?.length) {
          form.setError(inputName, invalidInputError);
        } else {
          form.clearErrors(inputName);
        }
      } catch {
        form.setError(inputName, invalidInputError);
      }
    } else {
      form.setError(inputName, invalidInputError);
    }
  };

  return (
    <Flex flexDir="column">
      <Textarea
        fontFamily="mono"
        placeholder={solidityType}
        {...(restOfInputProps as TextareaProps)}
        value={form.watch(inputName)}
        onChange={handleChange}
      />
      <FormHelperText>
        Input should be passed in JSON format - Ex:{" "}
        {formatHint(solidityType, solidityComponents)}
      </FormHelperText>
    </Flex>
  );
};
