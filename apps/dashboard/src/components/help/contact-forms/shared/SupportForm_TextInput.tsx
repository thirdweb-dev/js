import { FormControl, Input } from "@chakra-ui/react";
import type { HTMLInputTypeAttribute } from "react";
import { useFormContext } from "react-hook-form";
import { FormLabel } from "tw-components";

type Props = {
  formLabel: string;
  formValue: `extraInfo_${string}`;
  required: boolean;
  inputType: HTMLInputTypeAttribute | undefined;
  placeholder?: string;
};
export const SupportForm_TextInput = (props: Props) => {
  const { formLabel, formValue, required, placeholder, inputType } = props;
  const { register } = useFormContext();
  return (
    <FormControl isRequired={required}>
      <FormLabel>{formLabel}</FormLabel>
      <Input
        autoComplete="off"
        {...register(formValue, {
          required,
        })}
        placeholder={placeholder || ""}
        type={inputType}
      />
    </FormControl>
  );
};
