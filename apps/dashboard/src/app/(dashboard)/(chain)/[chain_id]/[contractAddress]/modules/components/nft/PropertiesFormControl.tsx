import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PlusIcon, RotateCcwIcon, Trash2Icon } from "lucide-react";
import { type UseFormReturn, useFieldArray } from "react-hook-form";

type PropertiesFormValues = {
  attributes?: {
    trait_type: string;
    value: string;
  }[];
};

export function PropertiesFormControl<T extends PropertiesFormValues>(props: {
  form: UseFormReturn<T>;
}) {
  // T contains all properties of PropertiesFormValues, so this correct
  const form = props.form as unknown as UseFormReturn<PropertiesFormValues>;

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "attributes",
  });

  return (
    <div className="flex flex-col gap-4">
      <h4>Attributes</h4>

      {fields.length > 0 && (
        <div className="flex flex-col gap-3">
          {/* Addresses */}
          {fields.map((fieldItem, index) => (
            <div className="flex items-start gap-3" key={fieldItem.id}>
              <FormField
                control={form.control}
                name={`attributes.${index}.trait_type`}
                render={({ field }) => (
                  <FormItem className="grow">
                    <FormControl>
                      <Input {...field} placeholder="Trait Type" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`attributes.${index}.value`}
                render={({ field }) => (
                  <FormItem className="grow">
                    <FormControl>
                      <Input {...field} placeholder="Value" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                variant="outline"
                className="!text-destructive-text bg-background"
                onClick={() => remove(index)}
              >
                <Trash2Icon className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-row gap-3">
        <Button
          size="sm"
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => append({ trait_type: "", value: "" })}
        >
          <PlusIcon className="size-4" />
          Add Attribute
        </Button>

        {fields.length > 0 && (
          <Button
            className="flex items-center gap-2"
            variant="outline"
            size="sm"
            onClick={() => form.setValue("attributes", [])}
          >
            Reset
            <RotateCcwIcon className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
