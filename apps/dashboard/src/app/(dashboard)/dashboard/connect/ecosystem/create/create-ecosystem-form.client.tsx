"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ImageUpload } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateEcosystem } from "../hooks/use-create-ecosystem";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Ecosystem name is required",
  }),
  logo: z.instanceof(File, {
    message: "Logo is required",
  }),
  permissions: z.union([z.literal("PARTNER_WHITELIST"), z.literal("ANYONE")]),
});

const nameToId = (name: string) =>
  `ecosystem.${name.toLowerCase().replaceAll(" ", "-")}`;

export function CreateEcosystemForm() {
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      permissions: "PARTNER_WHITELIST",
    },
  });

  const { mutate: submit, isLoading } = useCreateEcosystem({
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Failed to create ecosystem";
      form.setError("root", { type: "400", message });
    },
    onSuccess: (id: string) => {
      form.reset();
      router.push(`/dashboard/connect/ecosystem/${id}`);
    },
  });

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(() => setConfirmationOpen(true))}
          className="space-y-8"
        >
          <div className="grid space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ecosystem Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Aperture Laboratories" {...field} />
                  </FormControl>
                  <FormDescription>
                    Ecosystem ID:{" "}
                    {field.value
                      ? nameToId(field.value)
                      : "ecosystem.aperture-laboratories"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logo"
              render={() => (
                <FormItem>
                  <FormLabel>Ecosystem Logo</FormLabel>
                  <FormControl>
                    <ImageUpload
                      accept="image/png, image/jpeg"
                      onUpload={(files) => {
                        form.setValue("logo", files[0]);
                        form.clearErrors("logo");
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    The logo will be displayed as the ecosystem's wallet icon.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="permissions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Integration permissions</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue="PARTNER_WHITELIST"
                      className="flex gap-4 py-2"
                    >
                      <FormItem>
                        <FormControl>
                          <RadioGroupItem
                            value="PARTNER_WHITELIST"
                            id="PARTNER_WHITELIST"
                          >
                            Allowlist
                          </RadioGroupItem>
                        </FormControl>
                      </FormItem>
                      <FormItem>
                        <FormControl>
                          <RadioGroupItem value="ANYONE" id="ANYONE">
                            Public
                          </RadioGroupItem>
                        </FormControl>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col items-start gap-2">
            <Button
              type="submit"
              variant="primary"
              className="min-w-28"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create
            </Button>
            {form.formState.errors.root?.message && (
              <FormMessage>{form.formState.errors.root?.message}</FormMessage>
            )}
          </div>
        </form>
      </Form>
      <ConfirmationDialog
        open={confirmationOpen}
        onOpenChange={setConfirmationOpen}
        name={form.getValues().name}
        onSubmit={() =>
          submit({
            id: nameToId(form.getValues().name),
            name: form.getValues().name,
            logo: form.getValues().logo,
            permission: form.getValues().permissions,
          })
        }
      />
    </>
  );
}

function ConfirmationDialog({
  open,
  onOpenChange,
  name,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  onSubmit: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to create ecosystem {name}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Your account will be charged $250 per month.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant="primary"
            type="submit"
            onClick={() => {
              onSubmit();
              onOpenChange(false);
            }}
          >
            Continue
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
