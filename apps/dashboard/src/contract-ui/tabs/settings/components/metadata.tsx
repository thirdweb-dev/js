import { AdminOnly } from "@3rdweb-sdk/react/components/roles/admin-only";
import {
  Box,
  Flex,
  FormControl,
  Icon,
  IconButton,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ExtensionDetectedState } from "components/buttons/ExtensionDetectButton";
import { TransactionButton } from "components/buttons/TransactionButton";
import { FileInput } from "components/shared/FileInput";
import { CommonContractSchema } from "constants/schemas";
import { useTrack } from "hooks/analytics/useTrack";
import { useImageFileOrUrl } from "hooks/useImageFileOrUrl";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { FiPlus, FiTrash } from "react-icons/fi";
import type { ThirdwebContract } from "thirdweb";
import {
  getContractMetadata,
  setContractMetadata,
} from "thirdweb/extensions/common";
import { useReadContract, useSendAndConfirmTransaction } from "thirdweb/react";
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
}: {
  contract: ThirdwebContract;
  detectedState: ExtensionDetectedState;
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
    return {
      ...metadata.data,
      name: metadata.data?.name || "",
      image: metadata.data?.image || "",
      dashboard_social_urls: Object.entries(socialUrls).map(([key, value]) => ({
        key,
        value,
      })),
    };
  }, [metadata.data]);

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
          <Flex direction="column">
            <Heading size="title.md">Metadata</Heading>
            <Text size="body.md" fontStyle="italic">
              Settings to organize and distinguish between your different
              contracts.
            </Text>
          </Flex>
          <Flex gap={4} direction={{ base: "column", md: "row" }}>
            <Flex
              flexShrink={0}
              flexGrow={1}
              maxW={{ base: "100%", md: "160px" }}
            >
              <FormControl
                display="flex"
                flexDirection="column"
                isDisabled={metadata.isLoading || sendTransaction.isPending}
                isInvalid={!!getFieldState("image", formState).error}
              >
                <FormLabel>Image</FormLabel>
                <FileInput
                  isDisabled={metadata.isLoading || sendTransaction.isPending}
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
                  isDisabled={metadata.isLoading || sendTransaction.isPending}
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
                isDisabled={metadata.isLoading || sendTransaction.isPending}
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
              isDisabled={metadata.isLoading || sendTransaction.isPending}
            >
              <FormLabel>Social URLs</FormLabel>
            </FormControl>
            {fields.map((item, index) => (
              <Flex key={item.id}>
                <FormControl
                  isDisabled={metadata.isLoading || sendTransaction.isPending}
                >
                  <FormLabel textTransform="capitalize">
                    {/* biome-ignore lint/suspicious/noExplicitAny: FIXME */}
                    {(item as any).key ||
                      extractDomain(
                        watch(`dashboard_social_urls.${index}.value`),
                      ) ||
                      "New URL"}
                  </FormLabel>
                  <Flex gap={2}>
                    <Input
                      isDisabled={
                        metadata.isLoading || sendTransaction.isPending
                      }
                      {...register(`dashboard_social_urls.${index}.value`)}
                      type="url"
                      placeholder="https://..."
                    />
                    <IconButton
                      isDisabled={
                        metadata.isLoading || sendTransaction.isPending
                      }
                      icon={<Icon as={FiTrash} boxSize={5} />}
                      aria-label="Remove row"
                      onClick={() => remove(index)}
                    />
                  </Flex>
                </FormControl>
              </Flex>
            ))}
            <Box>
              <Button
                isDisabled={metadata.isLoading || sendTransaction.isPending}
                type="button"
                size="sm"
                colorScheme="primary"
                borderRadius="md"
                leftIcon={<Icon as={FiPlus} />}
                onClick={() => append({ key: "", value: "" })}
              >
                Add URL
              </Button>
            </Box>
          </Flex>
        </Flex>

        <AdminOnly contract={contract}>
          <TransactionButton
            colorScheme="primary"
            transactionCount={1}
            isDisabled={metadata.isLoading || !formState.isDirty}
            type="submit"
            isLoading={sendTransaction.isPending}
            loadingText="Saving..."
            size="md"
            borderRadius="xl"
            borderTopLeftRadius="0"
            borderTopRightRadius="0"
          >
            Update Metadata
          </TransactionButton>
        </AdminOnly>
      </Flex>
    </Card>
  );
};
