import { PlusIcon } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ExternalLinksInput } from "./external-links-input";

export const ExternalLinksFieldset = () => {
  const form = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "externalLinks",
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
          <ExternalLinksInput index={index} key={item.id} remove={remove} />
        ))}
        <div>
          <Button
            className="gap-2"
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
            <PlusIcon className="size-5" />
            Add Resource
          </Button>
        </div>
      </div>
    </fieldset>
  );
};
