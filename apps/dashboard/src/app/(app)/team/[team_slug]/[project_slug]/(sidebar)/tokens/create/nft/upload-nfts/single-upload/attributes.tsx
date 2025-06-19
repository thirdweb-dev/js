"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { type UseFormReturn, useFieldArray } from "react-hook-form";

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
    name: "attributes",
    control: form.control,
  });

  return (
    <div className="">
      <h2 className="mb-2 font-medium text-sm">Attributes</h2>

      {fields.length > 0 && (
        <div className="mb-3 space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex gap-4 max-sm:mb-6 max-sm:border-b max-sm:border-dashed max-sm:pb-6"
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
                          placeholder="Name"
                          aria-label="Name"
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
                          placeholder="Value"
                          aria-label="Value"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="button"
                variant="outline"
                className="rounded-full text-muted-foreground"
                size="icon"
                onClick={() => remove(index)}
              >
                <Trash2Icon className="h-4 w-4" />
                <span className="sr-only">Remove</span>
              </Button>
            </div>
          ))}
        </div>
      )}

      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => append({ trait_type: "", value: "" })}
        className="h-auto gap-1.5 rounded-full px-3 py-1.5 text-xs"
      >
        <PlusIcon className="size-3.5" />
        Add Attribute
      </Button>
    </div>
  );
}
