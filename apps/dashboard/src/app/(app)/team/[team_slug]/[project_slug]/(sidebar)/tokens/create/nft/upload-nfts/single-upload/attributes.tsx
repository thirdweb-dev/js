"use client";

import { PlusIcon, Trash2Icon } from "lucide-react";
import { type UseFormReturn, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type WithAttributes = {
  attributes?: {
    trait_type: string;
    value: string;
  }[];
};

export function AttributesFieldset<T extends WithAttributes>(props: {
  form: UseFormReturn<T>;
}) {
  // T contains all properties of WithSocialUrls, so this is ok
  const form = props.form as unknown as UseFormReturn<WithAttributes>;

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "attributes",
  });

  return (
    <div className="">
      <h2 className="mb-2 font-medium text-sm">Attributes</h2>

      {fields.length > 0 && (
        <div className="mb-3 space-y-4">
          {fields.map((field, index) => (
            <div
              className="flex gap-4 max-sm:mb-6 max-sm:border-b max-sm:border-dashed max-sm:pb-6"
              key={field.id}
            >
              <div className="flex flex-1 flex-col gap-3 lg:flex-row">
                <FormField
                  control={form.control}
                  name={`attributes.${index}.trait_type`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          {...field}
                          aria-label="Name"
                          placeholder="Name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`attributes.${index}.value`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          {...field}
                          aria-label="Value"
                          placeholder="Value"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                className="rounded-full text-muted-foreground"
                onClick={() => remove(index)}
                size="icon"
                type="button"
                variant="outline"
              >
                <Trash2Icon className="h-4 w-4" />
                <span className="sr-only">Remove</span>
              </Button>
            </div>
          ))}
        </div>
      )}

      <Button
        className="h-auto gap-1.5 rounded-full px-3 py-1.5 text-xs"
        onClick={() => append({ trait_type: "", value: "" })}
        size="sm"
        type="button"
        variant="outline"
      >
        <PlusIcon className="size-3.5" />
        Add Attribute
      </Button>
    </div>
  );
}
