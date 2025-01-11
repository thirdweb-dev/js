"use client";

import { AdminOnly } from "@3rdweb-sdk/react/components/roles/admin-only";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import {
  Flex,
  FormControl,
  IconButton,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ExtensionDetectedState } from "components/buttons/ExtensionDetectedState";
import { TransactionButton } from "components/buttons/TransactionButton";
import { FileInput } from "components/shared/FileInput";
import { CommonContractSchema } from "constants/schemas";
import { useTrack } from "hooks/analytics/useTrack";
import { useImageFileOrUrl } from "hooks/useImageFileOrUrl";
import { useTxNotifications } from "hooks/useTxNotifications";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import type { ThirdwebContract } from "thirdweb";
import {
  getContractMetadata,
  setContractMetadata,
} from "thirdweb/extensions/common";
import { useReadContract, useSendAndConfirmTransaction } from "thirdweb/react";
import { resolveScheme } from "thirdweb/storage";
import {
  Button,
  Card,
  FormErrorMessage,
  FormLabel,
  Heading,
  Text,
} from "tw-components";
import { z } from "zod";
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
  twAccount,
}: {
  contract: ThirdwebContract;
  detectedState: ExtensionDetectedState;
  twAccount: Account | undefined;
}) => {
  const trackEvent = useTrack();
  const metadata = useReadContract(getContractMetadata, { contract });
  const sendTransaction = useSendAndConfirmTransaction();

  const transformedQueryData = useMemo(() => {
    let socialUrls: z.infer<typeof SocialUrlSchema> = {
      twitter: "",
      discord: "",
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
      name: metadata.data?.name || "",
      image: image || "",
      dashboard_social_urls: Object.entries(socialUrls).map(([key, value]) => ({
        key,
        value,
      })),
    };
  }, [metadata.data, contract.client]);

  const {
    control,
    setValue,
    register,
    watch,
    handleSubmit,
    formState,
    getFieldState,
  } = useForm<z.input<typeof DashboardCommonContractSchema>>({
    resolver: zodResolver(DashboardCommonContractSchema),
    defaultValues: transformedQueryData,
    values: transformedQueryData,
    resetOptions: {
      keepDirty: true,
      keepDirtyValues: true,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    // @ts-expect-error - TODO: fix this
    name: "dashboard_social_urls",
  });

  const { onSuccess, onError } = useTxNotifications(
    "Successfully updated metadata",
    "Error updating metadata",
    contract,
  );

  return (
    <Card p={0} position="relative">
      <SettingDetectedState type="metadata" detectedState={detectedState} />
      <Flex
        as="form"
        onSubmit={handleSubmit((d) => {
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
              const domain = extractDomain(item.value);
              if (domain && item.value.trim() !== "") {
                obj[domain] = item.value;
              }
              return obj;
            },
            {},
          );

          trackEvent({
            category: "settings",
            action: "set-metadata",
            label: "attempt",
          });

          const tx = setContractMetadata({
            contract,
            ...data,
            social_urls: socialUrlsObj,
          });

          sendTransaction.mutate(tx, {
            onSuccess: () => {
              trackEvent({
                category: "settings",
                action: "set-metadata",
                label: "success",
              });
              onSuccess();
            },
            onError: (error) => {
              trackEvent({
                category: "settings",
                action: "set-metadata",
                label: "error",
                error,
              });
              onError(error);
            },
          });
        })}
        direction="column"
      >
        <Flex p={{ base: 6, md: 10 }} as="section" direction="column" gap={4}>
          <div className="flex flex-col">
            <Heading size="title.md">Metadata</Heading>
            <Text size="body.md" fontStyle="italic">
              Settings to organize and distinguish between your different
              contracts.
            </Text>
          </div>
          <Flex gap={4} direction={{ base: "column", md: "row" }}>
            <Flex
              flexShrink={0}
              flexGrow={1}
              maxW={{ base: "100%", md: "160px" }}
            >
              <FormControl
                display="flex"
                flexDirection="column"
                isDisabled={metadata.isPending || sendTransaction.isPending}
                isInvalid={!!getFieldState("image", formState).error}
              >
                <FormLabel>Image</FormLabel>
                <FileInput
                  isDisabled={metadata.isPending || sendTransaction.isPending}
                  accept={{ "image/*": [] }}
                  value={useImageFileOrUrl(watch("image"))}
                  setValue={(file) =>
                    setValue("image", file, {
                      shouldTouch: true,
                      shouldDirty: true,
                    })
                  }
                  className="rounded border border-border transition-all duration-200"
                />
                <FormErrorMessage>
                  {getFieldState("image", formState).error?.message}
                </FormErrorMessage>
              </FormControl>
            </Flex>

            <Flex
              direction="column"
              gap={4}
              flexGrow={1}
              justify="space-between"
            >
              <Flex gap={4} direction={{ base: "column", md: "row" }}>
                <FormControl
                  isDisabled={metadata.isPending || sendTransaction.isPending}
                  isInvalid={!!getFieldState("name", formState).error}
                >
                  <FormLabel>Name</FormLabel>
                  <Input variant="filled" {...register("name")} />
                  <FormErrorMessage>
                    {getFieldState("name", formState).error?.message}
                  </FormErrorMessage>
                </FormControl>
              </Flex>

              <FormControl
                isDisabled={metadata.isPending || sendTransaction.isPending}
                isInvalid={!!getFieldState("description", formState).error}
              >
                <FormLabel>Description</FormLabel>
                <Textarea variant="filled" {...register("description")} />
                <FormErrorMessage>
                  {getFieldState("description", formState).error?.message}
                </FormErrorMessage>
              </FormControl>
            </Flex>
          </Flex>
          <Flex direction="column" gap={4}>
            <FormControl
              isDisabled={metadata.isPending || sendTransaction.isPending}
            >
              <FormLabel>Social URLs</FormLabel>
            </FormControl>
            {fields.map((item, index) => (
              <Flex key={item.id}>
                <FormControl
                  isDisabled={metadata.isPending || sendTransaction.isPending}
                >
                  <FormLabel textTransform="capitalize">
                    {/* biome-ignore lint/suspicious/noExplicitAny: FIXME */}
                    {(item as any).key ||
                      extractDomain(
                        watch(`dashboard_social_urls.${index}.value`),
                      ) ||
                      "New URL"}
                  </FormLabel>
                  <div className="flex flex-row gap-2">
                    <Input
                      isDisabled={
                        metadata.isPending || sendTransaction.isPending
                      }
                      {...register(`dashboard_social_urls.${index}.value`)}
                      type="url"
                      placeholder="https://..."
                    />
                    <IconButton
                      isDisabled={
                        metadata.isPending || sendTransaction.isPending
                      }
                      icon={<Trash2Icon className="size-5" />}
                      aria-label="Remove row"
                      onClick={() => remove(index)}
                    />
                  </div>
                </FormControl>
              </Flex>
            ))}
            <div>
              <Button
                isDisabled={metadata.isPending || sendTransaction.isPending}
                type="button"
                size="sm"
                colorScheme="primary"
                borderRadius="md"
                leftIcon={<PlusIcon className="size-5" />}
                onClick={() => append({ key: "", value: "" })}
              >
                Add URL
              </Button>
            </div>
          </Flex>
        </Flex>

        <AdminOnly contract={contract}>
          <TransactionButton
            twAccount={twAccount}
            txChainID={contract.chain.id}
            transactionCount={1}
            disabled={metadata.isPending || !formState.isDirty}
            type="submit"
            isPending={sendTransaction.isPending}
            className="!rounded-t-none rounded-xl"
          >
            {sendTransaction.isPending
              ? "Updating Metadata"
              : "Update Metadata"}
          </TransactionButton>
        </AdminOnly>
      </Flex>
    </Card>
  );
};
