import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { HTMLInputTypeAttribute } from "react";

type Props = {
  formLabel: string;
  formValue: `extraInfo_${string}`;
  required: boolean;
  inputType: HTMLInputTypeAttribute | undefined;
  placeholder?: string;
};
export const SupportForm_TextInput = (props: Props) => {
  const { formLabel, formValue, required, placeholder, inputType } = props;
  return (
    <div className="flex flex-col items-start gap-2">
      <Label htmlFor={formValue} className="relative">
        {formLabel}
        {required && (
          <span className="-top-1.5 -right-2 absolute text-destructive">•</span>
        )}
      </Label>

      <Input
        name={formValue}
        placeholder={placeholder}
        type={inputType}
        required={required}
      />
    </div>
  );
};
