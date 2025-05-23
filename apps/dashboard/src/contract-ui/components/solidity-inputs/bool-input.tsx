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
          size="sm"
          onClick={() => form.setValue(inputName, "true")}
          variant={watchInput === "true" ? "default" : "outline"}
          className="rounded-none border-r-0"
        >
          True
        </Button>
        <Button
          size="sm"
          onClick={() => form.setValue(inputName, "false")}
          variant={watchInput === "false" ? "default" : "outline"}
          className="rounded-none rounded-l-none"
        >
          False
        </Button>
      </div>
    </div>
  );
};
