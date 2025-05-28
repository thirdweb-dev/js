import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { TrashIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";

interface ExternalLinksInputProps {
  index: number;
  remove: (index: number) => void;
}

export const ExternalLinksInput: React.FC<ExternalLinksInputProps> = ({
  index,
  remove,
}) => {
  const form = useFormContext();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-full flex-col gap-4 md:flex-row md:gap-2">
        <div className="flex flex-1 flex-col gap-1">
          <Label htmlFor={`externalLinks.${index}.name`} className="capitalize">
            Resource Name
          </Label>
          <Input
            id={`externalLinks.${index}.name`}
            placeholder="Resource name"
            {...form.register(`externalLinks.${index}.name`)}
          />
          {form.getFieldState(`externalLinks.${index}.name`, form.formState)
            .error?.message && (
            <p className="text-destructive-text text-sm">
              {
                form.getFieldState(
                  `externalLinks.${index}.name`,
                  form.formState,
                ).error?.message
              }
            </p>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <Label htmlFor={`externalLinks.${index}.url`} className="capitalize">
            Link
          </Label>
          <Input
            id={`externalLinks.${index}.url`}
            placeholder="Provide URL to the resource page"
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
          {form.getFieldState(`externalLinks.${index}.url`, form.formState)
            .error?.message && (
            <p className="text-destructive-text text-sm">
              {
                form.getFieldState(`externalLinks.${index}.url`, form.formState)
                  .error?.message
              }
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Remove row"
          onClick={() => remove(index)}
          className="self-end"
        >
          <TrashIcon className="size-5" />
          <span className="sr-only">Remove row</span>
        </Button>
      </div>
      <Separator />
    </div>
  );
};
