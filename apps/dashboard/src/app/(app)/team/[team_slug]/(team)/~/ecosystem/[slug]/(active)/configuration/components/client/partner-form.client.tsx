"use client";
import { Spinner } from "@/components/ui/Spinner/Spinner";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import type { ThirdwebClient } from "thirdweb";
import type { z } from "zod";
import type { Partner } from "../../../../../types";
import { partnerFormSchema } from "../../constants";
import { AllowedOperationsSection } from "./allowed-operations-section";

export type PartnerFormValues = z.infer<typeof partnerFormSchema>;

type PartnerFormProps = {
  partner?: Partner; // Optional for add form
  onSubmit: (
    values: PartnerFormValues,
    finalAccessControl: Partner["accessControl"] | null,
  ) => void;
  isSubmitting: boolean;
  submitLabel: string;
  client: ThirdwebClient;
};

export function PartnerForm({
  partner,
  onSubmit,
  isSubmitting,
  submitLabel,
  client,
}: PartnerFormProps) {
  // Check if partner has accessControl and serverVerifier
  const hasAccessControl = partner ? !!partner.accessControl : false;
  const hasServerVerifier =
    hasAccessControl && !!partner?.accessControl?.serverVerifier;
  const hasAllowedOperations =
    hasAccessControl && !!partner?.accessControl?.allowedOperations?.length;

  const form = useForm<PartnerFormValues>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: {
      name: partner?.name || "",
      domains: partner?.allowlistedDomains.join(",") || "",
      bundleIds: partner?.allowlistedBundleIds.join(",") || "",
      // Set the actual accessControl data if it exists
      accessControl: partner?.accessControl,
      // Set the UI control properties based on existing data
      accessControlEnabled: hasAccessControl,
      serverVerifierEnabled: hasServerVerifier,
      allowedOperationsEnabled: hasAllowedOperations,
    },
    mode: "onChange", // Validate on change for better user experience
  });

  // Watch the boolean flags for UI state
  const accessControlEnabled = form.watch("accessControlEnabled");
  const serverVerifierEnabled = form.watch("serverVerifierEnabled");
  const allowedOperationsEnabled = form.watch("allowedOperationsEnabled");

  // Setup field array for headers
  const customHeaderFields = useFieldArray({
    control: form.control,
    name: "accessControl.serverVerifier.headers",
  });

  const handleSubmit = form.handleSubmit(
    (values) => {
      // Construct the final accessControl object based on the enabled flags
      let finalAccessControl: Partner["accessControl"] | null = null;

      if (values.accessControlEnabled) {
        finalAccessControl = {} as Partner["accessControl"];

        if (finalAccessControl && values.serverVerifierEnabled) {
          finalAccessControl.serverVerifier = {
            url: values.accessControl?.serverVerifier?.url || "",
            headers: values.accessControl?.serverVerifier?.headers || [],
          };
        }

        if (finalAccessControl && values.allowedOperationsEnabled) {
          finalAccessControl.allowedOperations =
            values.accessControl?.allowedOperations || [];
        }

        // if no values have been set, remove the accessControl object
        if (
          finalAccessControl &&
          Object.keys(finalAccessControl).length === 0
        ) {
          finalAccessControl = null;
        }
      }

      onSubmit(values, finalAccessControl);
    },
    (errors) => {
      // Log validation errors for debugging
      console.error("Form validation errors:", errors);
    },
  );

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex grow flex-col gap-5">
          <FormField
            control={form.control}
            name="name"
            defaultValue=""
            render={({ field }) => (
              <FormItem className="col-span-4">
                <FormLabel> Name </FormLabel>
                <FormControl>
                  <Input
                    placeholder="App name"
                    {...field}
                    value={field.value}
                  />
                </FormControl>
                <FormDescription
                  className={cn(
                    "text-xs transition-all",
                    form.formState.errors.name?.message
                      ? "block translate-y-0 text-destructive opacity-100"
                      : "hidden opacity-0",
                  )}
                >
                  {form.formState.errors.name?.message}
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="domains"
            defaultValue=""
            render={({ field }) => (
              <FormItem className="col-span-4 lg:col-span-4">
                <FormLabel> Domains </FormLabel>
                <FormControl>
                  <Input placeholder="Domains" className="peer" {...field} />
                </FormControl>
                <FormDescription
                  className={cn(
                    "block text-xs",
                    form.formState.errors.domains?.message &&
                      "block translate-y-0 text-destructive opacity-100",
                  )}
                >
                  {form.formState.errors.domains?.message ??
                    "Space or comma-separated list of regex domains (e.g. *.example.com)"}
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bundleIds"
            defaultValue=""
            render={({ field }) => (
              <FormItem className="col-span-4">
                <FormLabel> Bundle ID </FormLabel>
                <FormControl>
                  <Input placeholder="Bundle ID" className="peer" {...field} />
                </FormControl>
                <FormDescription
                  className={cn(
                    "block text-xs",
                    form.formState.errors.bundleIds?.message &&
                      "block text-destructive",
                  )}
                >
                  {form.formState.errors.bundleIds?.message ??
                    "Space or comma-separated list of bundle IDs"}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Access Control Section */}
          <div className="mb-4 flex items-center justify-between gap-6">
            <div>
              <Label htmlFor="access-control-switch" className="text-base">
                Access Control
              </Label>
              <p className="mt-0.5 text-muted-foreground text-xs">
                Enable access control for this partner
              </p>
            </div>
            <Switch
              id="access-control-switch"
              checked={accessControlEnabled}
              onCheckedChange={(checked) => {
                form.setValue("accessControlEnabled", checked);
                // If disabling access control, also disable server verifier and allowed operations
                if (!checked) {
                  form.setValue("serverVerifierEnabled", false);
                  form.setValue("allowedOperationsEnabled", false);
                }
              }}
            />
          </div>

          {accessControlEnabled && (
            <>
              <div className="rounded-lg border border-border p-4">
                <div className="mb-4 flex items-center justify-between gap-6">
                  <div>
                    <Label
                      htmlFor="server-verifier-switch"
                      className="text-base"
                    >
                      Server Verifier
                    </Label>
                    <p className="mt-0.5 text-muted-foreground text-xs">
                      Configure a server verifier for access control
                    </p>
                  </div>
                  <Switch
                    id="server-verifier-switch"
                    checked={serverVerifierEnabled}
                    onCheckedChange={(checked) => {
                      form.setValue("serverVerifierEnabled", checked);

                      // Initialize serverVerifier fields if enabling
                      if (
                        checked &&
                        !form.getValues("accessControl.serverVerifier")
                      ) {
                        form.setValue("accessControl.serverVerifier", {
                          url: "",
                          headers: [],
                        });
                      }
                    }}
                  />
                </div>

                {serverVerifierEnabled && (
                  <div className="mt-4 grid grid-cols-1 gap-6">
                    <FormField
                      control={form.control}
                      name="accessControl.serverVerifier.url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Server Verifier URL</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="https://example.com/your-verifier"
                            />
                          </FormControl>
                          <FormDescription
                            className={cn(
                              "text-xs",
                              form.formState.errors.accessControl
                                ?.serverVerifier?.url && "text-destructive",
                            )}
                          >
                            {form.formState.errors.accessControl?.serverVerifier
                              ?.url?.message ||
                              "Enter the URL of your server where verification requests will be sent"}
                          </FormDescription>
                        </FormItem>
                      )}
                    />

                    <div>
                      <Label className="mb-3 inline-block">
                        Custom Headers
                      </Label>
                      <div className="flex flex-col gap-4">
                        {customHeaderFields.fields.map((field, headerIdx) => {
                          return (
                            <div className="flex gap-4" key={field.id}>
                              <Input
                                placeholder="Name"
                                type="text"
                                {...form.register(
                                  `accessControl.serverVerifier.headers.${headerIdx}.key`,
                                )}
                              />
                              <Input
                                placeholder="Value"
                                type="text"
                                {...form.register(
                                  `accessControl.serverVerifier.headers.${headerIdx}.value`,
                                )}
                              />
                              <Button
                                variant="outline"
                                aria-label="Remove header"
                                onClick={() => {
                                  customHeaderFields.remove(headerIdx);
                                }}
                                className="!w-auto px-3"
                                type="button"
                              >
                                <Trash2Icon className="size-4 shrink-0 text-destructive-text" />
                              </Button>
                            </div>
                          );
                        })}

                        <Button
                          variant="outline"
                          className="w-full gap-2 bg-background"
                          onClick={() => {
                            customHeaderFields.append({
                              key: "",
                              value: "",
                            });
                          }}
                          type="button"
                        >
                          <PlusIcon className="size-4" />
                          Add header
                        </Button>
                      </div>

                      <p className="mt-3 text-muted-foreground text-xs">
                        Set custom headers to be sent along with verification
                        requests
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Allowed Operations Section */}
              <AllowedOperationsSection
                client={client}
                control={form.control}
                enabled={allowedOperationsEnabled}
                onToggle={(checked) => {
                  form.setValue("allowedOperationsEnabled", checked);

                  // Initialize allowedOperations array if enabling
                  if (
                    checked &&
                    !form.getValues("accessControl.allowedOperations")
                  ) {
                    form.setValue("accessControl.allowedOperations", []);
                  }
                }}
              />
            </>
          )}
        </div>

        <Button
          disabled={isSubmitting}
          type="submit"
          className="mt-4 w-full gap-2"
        >
          {isSubmitting && <Spinner className="size-4" />}
          {submitLabel}
        </Button>
      </form>
    </Form>
  );
}
