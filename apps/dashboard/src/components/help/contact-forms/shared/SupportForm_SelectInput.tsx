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
    <>
      <div className="flex flex-col items-start gap-2">
        <Label className="relative" htmlFor={name}>
          {formLabel}
          {required && (
            <span className="-top-1.5 -right-2 absolute text-destructive">
              •
            </span>
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
