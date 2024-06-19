import { FormControl, Textarea } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { FormLabel } from "tw-components";

type Props = {
  placeholder?: string;
};

const defaultDescription =
  "Please describe the issue you're encountering in detail, including steps that led to the error, any error messages, troubleshooting steps you've already taken, and the product(s), dashboard, or SDKs involved.";

export const DescriptionInput = (props: Props) => {
  const { register } = useFormContext();
  return (
    <FormControl isRequired>
      <FormLabel>Description</FormLabel>
      <Textarea
        autoComplete="off"
        {...register("markdown", { required: true })}
        rows={7}
        maxLength={10000}
        placeholder={props.placeholder ?? defaultDescription}
      />
    </FormControl>
  );
};
