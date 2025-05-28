import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { ExternalLinksInput } from "./external-links-input";

export const ExternalLinksFieldset = () => {
  const form = useFormContext();

  const { fields, append, remove } = useFieldArray({
    name: "externalLinks",
    control: form.control,
  });

  // FIXME: all of this logic needs to be reworked
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (fields.length === 0) {
      append(
        {
          name: "",
          url: "",
        },
        { shouldFocus: false },
      );
    }
  }, [fields, append]);

  return (
    <fieldset className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-xl tracking-tight">Resources</h3>
        <p className="text-muted-foreground">
          Provide links to docs, usage guides etc. for the contract.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        {fields.map((item, index) => (
          <ExternalLinksInput key={item.id} remove={remove} index={index} />
        ))}
        <div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="gap-2"
            onClick={() =>
              append({
                name: "",
                url: "",
              })
            }
          >
            <PlusIcon className="size-5" />
            Add Resource
          </Button>
        </div>
      </div>
    </fieldset>
  );
};
