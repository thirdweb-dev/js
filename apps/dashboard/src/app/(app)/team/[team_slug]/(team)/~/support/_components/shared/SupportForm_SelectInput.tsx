import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  options: string[];
  promptText: string;
  formLabel: string;
  name: string;
  required: boolean;
  value: string | undefined;
  onValueChange: (value: string) => void;
};

export const SupportForm_SelectInput = (props: Props) => {
  const { options, formLabel, name, required, promptText } = props;

  return (
    <div className="flex flex-col items-start gap-3">
      <Label
        className="relative text-base font-medium text-white"
        htmlFor={name}
      >
        {formLabel}
        {required && (
          <span className="-top-1.5 -right-2 absolute text-red-500">•</span>
        )}
      </Label>

      <Select
        name={name}
        onValueChange={(val) => {
          props.onValueChange(val);
        }}
        required={required}
        value={props.value}
      >
        <SelectTrigger className="h-11 text-sm bg-[#0A0A0A] border-[#1F1F1F] text-white hover:border-[#333333] focus:border-[#2663EB]">
          <SelectValue placeholder={promptText}>{props.value}</SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-[#0A0A0A] border-[#1F1F1F]">
          {options.map((option) => (
            <SelectItem
              className="text-sm py-2 text-white hover:bg-[#1F1F1F] focus:bg-[#1F1F1F] data-[highlighted]:bg-[#1F1F1F]"
              key={option}
              value={option}
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
