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
      id={props.id}
      className="flex gap-6"
      value={props.value}
      onValueChange={(v) => {
        props.onValueChange(v as T);
      }}
    >
      {props.options.map((option) => {
        return (
          <div key={option.value} className={cn("flex items-center space-x-2")}>
            <RadioGroupItem value={option.value} id={option.value} />
            <Label htmlFor={option.value} className="cursor-pointer">
              {option.label}
            </Label>
          </div>
        );
      })}
    </RadioGroup>
  );
}
