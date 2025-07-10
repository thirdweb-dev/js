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

type WithSocialUrls = {
  socialUrls: {
    url: string;
    platform: string;
  }[];
};

export function SocialUrlsFieldset<T extends WithSocialUrls>(props: {
  form: UseFormReturn<T>;
}) {
  // T contains all properties of WithSocialUrls, so this is ok
  const form = props.form as unknown as UseFormReturn<WithSocialUrls>;

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "socialUrls",
  });

  return (
    <div className="border-t border-dashed px-4 py-6 lg:px-6">
      <h2 className="mb-2 font-medium text-sm">Social URLs</h2>

      {fields.length > 0 && (
        <div className="mb-4 space-y-3">
          {fields.map((field, index) => (
            <div
              className="flex gap-3 max-sm:mb-6 max-sm:border-b max-sm:border-dashed max-sm:pb-6"
              key={field.id}
            >
              <div className="flex flex-1 flex-col gap-3 lg:flex-row">
                <FormField
                  control={form.control}
                  name={`socialUrls.${index}.platform`}
                  render={({ field }) => (
                    <FormItem className="lg:max-w-[140px]">
                      <FormControl>
                        <Input
                          {...field}
                          aria-label="Platform"
                          placeholder="Platform"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`socialUrls.${index}.url`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          {...field}
                          aria-label="Platform URL"
                          placeholder="https://..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                className="rounded-full"
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
        onClick={() => append({ platform: "", url: "" })}
        size="sm"
        type="button"
        variant="outline"
      >
        <PlusIcon className="size-3.5" />
        Add Social URL
      </Button>
    </div>
  );
}
