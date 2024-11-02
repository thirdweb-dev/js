import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BanIcon, PlusIcon, Trash2Icon } from "lucide-react";
import {
  type ArrayPath,
  type FieldValues,
  type Path,
  type PathValue,
  type UseFormReturn,
  useFieldArray,
} from "react-hook-form";

interface IPropertyFieldValues extends FieldValues {
  attributes?: {
    trait_type: string;
    value: string;
  }[];
}

export function PropertiesFormControl<
  TFieldValues extends IPropertyFieldValues,
>({
  form,
}: {
  form: UseFormReturn<TFieldValues>;
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "attributes" as ArrayPath<TFieldValues>,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <p>Attributes</p>
        <Button
          className="flex items-center gap-2"
          variant="destructive"
          size="sm"
          onClick={() =>
            form.setValue(
              "attributes" as Path<TFieldValues>,
              // biome-ignore lint/suspicious/noExplicitAny: FIXME
              [{ trait_type: "", value: "" } as any] as PathValue<
                TFieldValues,
                Path<TFieldValues>
              >,
            )
          }
        >
          Reset
          <BanIcon className="size-4" />
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {/* Addresses */}
        {fields.map((fieldItem, index) => (
          <div className="flex items-start gap-3" key={fieldItem.id}>
            <FormField
              control={form.control}
              name={`attributes.${index}.trait_type` as Path<TFieldValues>}
              render={({ field }) => (
                <FormItem className="grow">
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`attributes.${index}.value` as Path<TFieldValues>}
              render={({ field }) => (
                <FormItem className="grow">
                  <FormControl>
                    <Input {...field} />
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

      <div className="flex flex-row gap-2">
        <Button
          size="sm"
          className="flex items-center gap-2"
          onClick={() =>
            // biome-ignore lint/suspicious/noExplicitAny: FIXME
            append({ trait_type: undefined, value: undefined } as any)
          }
        >
          <PlusIcon className="size-5" />
          Add Row
        </Button>
      </div>
    </div>
  );
}
