import { Button } from "@/components/ui/button";
import type { SolidityInputProps } from ".";

export const SolidityBoolInput: React.FC<SolidityInputProps> = ({
  formContext: form,
  ...inputProps
}) => {
  const { name } = inputProps;
  const inputName = name as string;
  const watchInput = form.watch(inputName);
  return (
    <div className="flex flex-row">
      <div className="inline-flex overflow-hidden rounded-md border border-border">
        <Button
          className="rounded-none border-r-0"
          onClick={() => form.setValue(inputName, "true")}
          size="sm"
          variant={watchInput === "true" ? "default" : "outline"}
        >
          True
        </Button>
        <Button
          className="rounded-none rounded-l-none"
          onClick={() => form.setValue(inputName, "false")}
          size="sm"
          variant={watchInput === "false" ? "default" : "outline"}
        >
          False
        </Button>
      </div>
    </div>
  );
};
