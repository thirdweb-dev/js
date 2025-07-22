import type { HTMLInputTypeAttribute } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Props = {
  formLabel: string;
  formValue: `extraInfo_${string}`;
  required: boolean;
  inputType: HTMLInputTypeAttribute | undefined;
  placeholder?: string;
  className?: string;
};

export const SupportForm_TextInput = (props: Props) => {
  const { formLabel, formValue, required, placeholder, inputType, className } =
    props;
  return (
    <div className={cn("flex flex-col items-start gap-2", className)}>
      <Label
        className="relative font-medium text-foreground"
        htmlFor={formValue}
      >
        {formLabel}
        {required && <span className="text-red-500 ml-1 align-middle">*</span>}
      </Label>

      <Input
        name={formValue}
        placeholder={placeholder}
        required={required}
        type={inputType}
      />
    </div>
  );
};
