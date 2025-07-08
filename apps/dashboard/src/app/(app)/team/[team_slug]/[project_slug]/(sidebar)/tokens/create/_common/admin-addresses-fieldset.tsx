"use client";

import { PlusIcon, Trash2Icon } from "lucide-react";
import { type UseFormReturn, useFieldArray } from "react-hook-form";
import { useActiveAccount } from "thirdweb/react";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type WithAdmins = {
  admins: {
    address: string;
  }[];
};

export function AdminAddressesFieldset<T extends WithAdmins>(props: {
  form: UseFormReturn<T>;
}) {
  // T contains all properties of WithAdmins, so this is ok
  const form = props.form as unknown as UseFormReturn<WithAdmins>;
  const account = useActiveAccount();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "admins",
  });

  const handleAddAddress = () => {
    append({ address: "" });
  };

  const handleRemoveAddress = (index: number) => {
    const field = fields[index];
    if (field?.address === account?.address) {
      return; // Don't allow removing the connected address
    }
    remove(index);
  };

  return (
    <div className="border-t border-dashed px-4 py-6 lg:px-6">
      <div className="mb-3">
        <h2 className="mb-1 font-medium text-sm">Admins</h2>
        <p className="text-sm text-muted-foreground">
          These wallets will have authority on the token
        </p>
      </div>

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
                  name={`admins.${index}.address`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          {...field}
                          aria-label="Admin Address"
                          disabled={field.value === account?.address}
                          placeholder="0x..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                className="rounded-full"
                disabled={field.address === account?.address}
                onClick={() => handleRemoveAddress(index)}
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
        onClick={handleAddAddress}
        size="sm"
        type="button"
        variant="outline"
      >
        <PlusIcon className="size-3.5" />
        Add Admin
      </Button>

      {form.watch("admins").length === 0 && (
        <p className="text-sm text-destructive mt-2">
          At least one admin address is required
        </p>
      )}
    </div>
  );
}
