"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ThirdwebContract } from "thirdweb";
import {
  getContractMetadata,
  setContractMetadata,
} from "thirdweb/extensions/common";
import { useReadContract } from "thirdweb/react";
import { resolveScheme } from "thirdweb/storage";
import { z } from "zod";
import { FileInput } from "@/components/blocks/FileInput";
import { AdminOnly } from "@/components/contracts/roles/admin-only";
import { TransactionButton } from "@/components/tx-button";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useSendAndConfirmTx } from "@/hooks/useSendTx";
import { CommonContractSchema } from "@/schema/schemas";
import type { ExtensionDetectedState } from "@/types/ExtensionDetectedState";
import { parseError } from "@/utils/errorParser";
import { SettingDetectedState } from "./detected-state";

const DashboardCommonContractSchema = CommonContractSchema.extend({
  dashboard_social_urls: z.array(
    z.object({
      key: z.string(),
      value: z.string(),
    }),
  ),
});

function extractDomain(url: string) {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;
    const hostnameWithoutWww = hostname.replace(/^www\./, "");
    const segments = hostnameWithoutWww.split(".");
    const domain =
      segments.length > 2 ? segments[segments.length - 2] : segments[0];
    return domain;
  } catch {
    return null;
  }
}

const SocialUrlSchema = z.record(z.string(), z.string());

export const SettingsMetadata = ({
  contract,
  detectedState,
  isLoggedIn,
}: {
  contract: ThirdwebContract;
  detectedState: ExtensionDetectedState;
  isLoggedIn: boolean;
}) => {
  const metadata = useReadContract(getContractMetadata, { contract });
  const sendTransaction = useSendAndConfirmTx();

  const transformedQueryData = useMemo(() => {
    let socialUrls: z.infer<typeof SocialUrlSchema> = {
      discord: "",
      twitter: "",
    };
    if (metadata.data?.social_urls) {
      try {
        const parsed = SocialUrlSchema.parse(metadata.data.social_urls);
        socialUrls = parsed;
      } catch (err) {
        console.error(err);
      }
    }
    let image: string | undefined = metadata.data?.image;
    try {
      image = image
        ? // eslint-disable-next-line no-restricted-syntax
          resolveScheme({
            client: contract.client,
            uri: image,
          })
        : undefined;
    } catch {
      // do nothing
    }
    return {
      ...metadata.data,
      dashboard_social_urls: Object.entries(socialUrls).map(([key, value]) => ({
        key,
        value,
      })),
      image: image || "",
      name: metadata.data?.name || "",
    };
  }, [metadata.data, contract.client]);

  const form = useForm<z.input<typeof DashboardCommonContractSchema>>({
    defaultValues: transformedQueryData,
    resetOptions: {
      keepDirty: true,
      keepDirtyValues: true,
    },
    resolver: zodResolver(DashboardCommonContractSchema),
    values: transformedQueryData,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    // @ts-expect-error - TODO: fix this
    name: "dashboard_social_urls",
  });

  const onSubmit = (d: z.input<typeof DashboardCommonContractSchema>) => {
    const { dashboard_social_urls, ...data } = d;

    const socialUrlsArray =
      Object.keys(dashboard_social_urls || {}).length > 0
        ? (dashboard_social_urls as unknown as {
            key: string;
            value: string;
          }[])
        : [];

    const socialUrlsObj = socialUrlsArray.reduce<Record<string, string>>(
      (obj, item) => {
        const platform = item.key || extractDomain(item.value);
        if (platform && item.value.trim() !== "") {
          obj[platform] = item.value;
        }
        return obj;
      },
      {},
    );

    const tx = setContractMetadata({
      contract,
      ...data,
      social_urls: socialUrlsObj,
    });

    sendTransaction.mutate(tx, {
      onError: (error) => {
        toast.error("Error updating metadata", {
          description: parseError(error),
        });
        console.error(error);
      },
      onSuccess: () => {
        toast.success("Metadata updated");
      },
    });
  };

  return (
    <div className="relative bg-card border rounded-lg">
      <SettingDetectedState detectedState={detectedState} type="metadata" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
          <div className="p-4 md:p-6">
            {/* header */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold tracking-tight">Metadata</h2>
              <p className="text-muted-foreground text-sm">
                Settings to organize and distinguish between your different
                contracts.
              </p>
            </div>

            {metadata.isPending ? (
              <Skeleton className="h-[432px] w-full" />
            ) : (
              <div>
                <div className="flex flex-col gap-6 md:flex-row mb-6">
                  {/* image */}
                  <div className="w-full max-w-full md:max-w-[200px]">
                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image</FormLabel>
                          <FormControl>
                            <FileInput
                              accept={{ "image/*": [] }}
                              className="rounded border border-border transition-all duration-200 bg-background"
                              client={contract.client}
                              setValue={(file) => field.onChange(file)}
                              value={field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex flex-col grow gap-6">
                    {/* name */}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input className="max-w-sm" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* description */}
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="grow flex flex-col">
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea className="grow" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Social URLs</h3>
                  <div className="space-y-4">
                    {fields.map((item, index) => (
                      <div
                        key={item.id}
                        className="flex flex-col lg:flex-row gap-3"
                      >
                        <FormField
                          control={form.control}
                          name={`dashboard_social_urls.${index}.key`}
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
                          name={`dashboard_social_urls.${index}.value`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input
                                  {...field}
                                  aria-label="Platform URL"
                                  placeholder="https://..."
                                  type="url"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          variant="outline"
                          className="rounded-full p-0 size-10 bg-background self-end"
                          onClick={() => remove(index)}
                          aria-label="Remove row"
                        >
                          <Trash2Icon className="size-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => append({ key: "", value: "" })}
                      className="flex items-center gap-2 rounded-full"
                    >
                      <PlusIcon className="size-3.5" />
                      Add URL
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <AdminOnly contract={contract}>
            <div className="px-4 lg:px-6 py-3 border-t border-dashed flex justify-end">
              <TransactionButton
                client={contract.client}
                disabled={metadata.isPending}
                isLoggedIn={isLoggedIn}
                isPending={sendTransaction.isPending}
                transactionCount={undefined}
                txChainID={contract.chain.id}
                type="submit"
                variant="default"
                size="sm"
              >
                Save
              </TransactionButton>
            </div>
          </AdminOnly>
        </form>
      </Form>
    </div>
  );
};
