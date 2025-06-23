import { cn } from "../../lib/utils";
import { Label } from "./label";
import { RadioGroup, RadioGroupItem } from "./radio-group";

export function CustomRadioGroup<T extends string>(props: {
  options: Array<{
    value: T;
    label: string;
  }>;
  onValueChange: (value: T) => void;
  value: T;
  id: string;
}) {
  return (
    <RadioGroup
      className="flex gap-6"
      id={props.id}
      onValueChange={(v) => {
        props.onValueChange(v as T);
      }}
      value={props.value}
    >
      {props.options.map((option) => {
        return (
          <div className={cn("flex items-center space-x-2")} key={option.value}>
            <RadioGroupItem id={option.value} value={option.value} />
            <Label className="cursor-pointer" htmlFor={option.value}>
              {option.label}
            </Label>
          </div>
        );
      })}
    </RadioGroup>
  );
}
