"use client";

import { AdminOnly } from "@3rdweb-sdk/react/components/roles/admin-only";
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
  isLoggedIn,
}: {
  contract: ThirdwebContract;
  detectedState: ExtensionDetectedState;
  isLoggedIn: boolean;
}) => {
  const metadata = useReadContract(getContractMetadata, { contract });
  const sendTransaction = useSendAndConfirmTransaction();

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

  const {
    control,
    setValue,
    register,
    watch,
    handleSubmit,
    formState,
    getFieldState,
  } = useForm<z.input<typeof DashboardCommonContractSchema>>({
    defaultValues: transformedQueryData,
    resetOptions: {
      keepDirty: true,
      keepDirtyValues: true,
    },
    resolver: zodResolver(DashboardCommonContractSchema),
    values: transformedQueryData,
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
    <Card overflow="hidden" p={0} position="relative">
      <SettingDetectedState detectedState={detectedState} type="metadata" />
      <Flex
        as="form"
        direction="column"
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

          const tx = setContractMetadata({
            contract,
            ...data,
            social_urls: socialUrlsObj,
          });

          sendTransaction.mutate(tx, {
            onError: (error) => {
              onError(error);
            },
            onSuccess: () => {
              onSuccess();
            },
          });
        })}
      >
        <Flex as="section" direction="column" gap={4} p={{ base: 6, md: 10 }}>
          <div className="flex flex-col">
            <Heading size="title.md">Metadata</Heading>
            <Text fontStyle="italic" size="body.md">
              Settings to organize and distinguish between your different
              contracts.
            </Text>
          </div>
          <Flex direction={{ base: "column", md: "row" }} gap={4}>
            <Flex
              flexGrow={1}
              flexShrink={0}
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
                  accept={{ "image/*": [] }}
                  className="rounded border border-border transition-all duration-200"
                  client={contract.client}
                  isDisabled={metadata.isPending || sendTransaction.isPending}
                  setValue={(file) =>
                    setValue("image", file, {
                      shouldDirty: true,
                      shouldTouch: true,
                    })
                  }
                  value={watch("image")}
                />
                <FormErrorMessage>
                  {getFieldState("image", formState).error?.message}
                </FormErrorMessage>
              </FormControl>
            </Flex>

            <Flex
              direction="column"
              flexGrow={1}
              gap={4}
              justify="space-between"
            >
              <Flex direction={{ base: "column", md: "row" }} gap={4}>
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
                      placeholder="https://..."
                      type="url"
                    />
                    <IconButton
                      aria-label="Remove row"
                      icon={<Trash2Icon className="size-5" />}
                      isDisabled={
                        metadata.isPending || sendTransaction.isPending
                      }
                      onClick={() => remove(index)}
                    />
                  </div>
                </FormControl>
              </Flex>
            ))}
            <div>
              <Button
                borderRadius="md"
                colorScheme="primary"
                isDisabled={metadata.isPending || sendTransaction.isPending}
                leftIcon={<PlusIcon className="size-5" />}
                onClick={() => append({ key: "", value: "" })}
                size="sm"
                type="button"
              >
                Add URL
              </Button>
            </div>
          </Flex>
        </Flex>

        <AdminOnly contract={contract}>
          <TransactionButton
            className="!rounded-t-none rounded-xl"
            client={contract.client}
            disabled={metadata.isPending || !formState.isDirty}
            isLoggedIn={isLoggedIn}
            isPending={sendTransaction.isPending}
            transactionCount={1}
            txChainID={contract.chain.id}
            type="submit"
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
