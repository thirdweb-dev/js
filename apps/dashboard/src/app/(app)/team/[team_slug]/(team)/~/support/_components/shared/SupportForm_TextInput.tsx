import type { HTMLInputTypeAttribute } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    <div className="flex flex-col items-start gap-3">
      <Label
        className="relative text-base font-medium text-white"
        htmlFor={formValue}
      >
        {formLabel}
        {required && (
          <span className="-top-1.5 -right-2 absolute text-red-500">•</span>
        )}
      </Label>

      <Input
        className="h-11 text-sm bg-[#0A0A0A] border-[#1F1F1F] text-white placeholder:text-[#737373] hover:border-[#333333] focus:border-[#2663EB] focus-visible:ring-0 focus-visible:ring-offset-0"
        name={formValue}
        placeholder={placeholder}
        required={required}
        type={inputType}
      />
    </div>
  );
};
