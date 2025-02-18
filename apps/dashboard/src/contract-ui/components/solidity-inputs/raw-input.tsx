import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { SolidityInputWithTypeProps } from ".";
import { formatHint, validateSolidityInput } from "./helpers";

type TextareaProps = React.ComponentProps<typeof Textarea>;

export const SolidityRawInput: React.FC<SolidityInputWithTypeProps> = ({
  formContext: form,
  solidityType,
  solidityComponents,
  ...inputProps
}) => {
  const { name, ...restOfInputProps } = inputProps;
  const inputName = name as string;

  const typeWithoutArray = solidityType.replace("[]", "");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    form.setValue(inputName, value);

    const invalidInputError = {
      type: "pattern",
      message:
        "Invalid input. Input should be passed in JSON format with valid values.",
    };

    const trimmedValue = value.trim();

    if (trimmedValue?.startsWith("[") && trimmedValue?.endsWith("]")) {
      try {
        const parsedValue: string[] = JSON.parse(trimmedValue);

        form.clearErrors(inputName);
        const isValid = parsedValue.every(
          (item) => !validateSolidityInput(item, typeWithoutArray),
        );
        if (!isValid) {
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
    <div className="flex flex-col">
      <Textarea
        placeholder={solidityType}
        {...(restOfInputProps as TextareaProps)}
        className={cn("font-mono", restOfInputProps.className)}
        value={form.watch(inputName)}
        onChange={handleChange}
      />
      <div className="mt-2 text-muted-foreground text-sm">
        Input should be passed in JSON format - Ex:{" "}
        {formatHint(solidityType, solidityComponents)}
      </div>
    </div>
  );
};
