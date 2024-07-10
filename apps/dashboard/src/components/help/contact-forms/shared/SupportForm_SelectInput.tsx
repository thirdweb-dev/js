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
  value: string;
  onValueChange: (value: string) => void;
};

export const SupportForm_SelectInput = (props: Props) => {
  const { options, formLabel, name, required, promptText } = props;

  return (
    <>
      <input
        hidden
        value={props.value}
        name={name}
        onChange={(e) => props.onValueChange(e.target.value)}
        required={required}
      />

      <div className="flex flex-col gap-2 items-start">
        <Label htmlFor={name} className="relative">
          {formLabel}
          {required && (
            <span className="absolute -top-1.5 -right-2 text-destructive">
              •
            </span>
          )}
        </Label>

        <Select
          value={props.value}
          onValueChange={(val) => {
            props.onValueChange(val);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder={promptText}>{props.value}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};
