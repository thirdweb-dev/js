import { FormControl, Select } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { FormLabel } from "tw-components";

type Props = {
  options: string[];
  promptText: string;
  formLabel: string;
  formValue: string;
  required: boolean;
};

export const SupportForm_SelectInput = (props: Props) => {
  const { register } = useFormContext();
  const { options, promptText, formLabel, formValue, required } = props;
  return (
    <FormControl isRequired>
      <FormLabel>{formLabel}</FormLabel>
      <Select {...register(formValue, { required })}>
        <option value="">{promptText}</option>
        {options.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </Select>
    </FormControl>
  );
};
