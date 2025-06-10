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
    name: "socialUrls",
    control: form.control,
  });

  return (
    <div className="border-t border-dashed px-4 py-6 lg:px-6">
      <h2 className="mb-2 font-medium text-sm">Social URLs</h2>

      {fields.length > 0 && (
        <div className="mb-5 space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex gap-3 max-sm:mb-6 max-sm:border-b max-sm:border-dashed max-sm:pb-6"
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
                          placeholder="Platform"
                          aria-label="Platform"
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
                          placeholder="https://..."
                          aria-label="Platform URL"
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
                size="icon"
                onClick={() => remove(index)}
                className="rounded-full"
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
        onClick={() => append({ platform: "", url: "" })}
        className="h-auto gap-1.5 rounded-full px-3 py-1.5 text-xs"
      >
        <PlusIcon className="size-3.5" />
        Add Social URL
      </Button>
    </div>
  );
}
