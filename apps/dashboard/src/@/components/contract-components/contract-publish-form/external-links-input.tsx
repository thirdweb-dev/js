import { TrashIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ExternalLinksInputProps {
  index: number;
  remove: (index: number) => void;
  disableRemove: boolean;
}

export const ExternalLinksInput: React.FC<ExternalLinksInputProps> = ({
  index,
  remove,
  disableRemove,
}) => {
  const form = useFormContext();

  return (
    <div className="flex w-full flex-col gap-3 md:flex-row">
      {/* Resource name */}
      <div className="flex flex-1 flex-col gap-2">
        <Label className="capitalize" htmlFor={`externalLinks.${index}.name`}>
          Name
        </Label>
        <Input
          id={`externalLinks.${index}.name`}
          {...form.register(`externalLinks.${index}.name`)}
          className="bg-card"
        />
        {form.getFieldState(`externalLinks.${index}.name`, form.formState).error
          ?.message && (
          <p className="text-destructive-text text-sm">
            {
              form.getFieldState(`externalLinks.${index}.name`, form.formState)
                .error?.message
            }
          </p>
        )}
      </div>

      {/* Resource URL */}
      <div className="flex flex-1 flex-col gap-2">
        <Label className="capitalize" htmlFor={`externalLinks.${index}.url`}>
          Link
        </Label>
        <Input
          id={`externalLinks.${index}.url`}
          className="bg-card"
          {...form.register(`externalLinks.${index}.url`, {
            required: true,
            validate: (value: string) => {
              if (value.match(new RegExp(/^https:\/\/[^\s/$.?#].[^\s]*$/))) {
                return true;
              }
              return "Provide a valid URL";
            },
          })}
        />
        {form.getFieldState(`externalLinks.${index}.url`, form.formState).error
          ?.message && (
          <p className="text-destructive-text text-sm">
            {
              form.getFieldState(`externalLinks.${index}.url`, form.formState)
                .error?.message
            }
          </p>
        )}
      </div>

      <Button
        className="self-end rounded-full p-0 bg-card"
        disabled={disableRemove}
        onClick={() => remove(index)}
        size="icon"
        variant="outline"
        aria-label="Remove resource"
      >
        <TrashIcon className="size-4" />
      </Button>
    </div>
  );
};
