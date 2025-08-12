import { PlusIcon } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ExternalLinksInput } from "./external-links-input";

export const ExternalLinksFieldset = () => {
  const form = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "externalLinks",
  });

  return (
    <fieldset>
      <div>
        <h3 className="font-semibold text-xl tracking-tight mb-1">Resources</h3>
        <p className="text-muted-foreground text-sm mb-5">
          Provide links to docs, usage guides etc. for the contract.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        {fields.map((item, index) => (
          <ExternalLinksInput
            index={index}
            key={item.id}
            remove={remove}
            disableRemove={fields.length === 1}
          />
        ))}
        <div>
          <Button
            className="gap-2 bg-card rounded-full"
            onClick={() =>
              append({
                name: "",
                url: "",
              })
            }
            size="sm"
            type="button"
            variant="outline"
          >
            <PlusIcon className="size-4" />
            Add Resource
          </Button>
        </div>
      </div>
    </fieldset>
  );
};
