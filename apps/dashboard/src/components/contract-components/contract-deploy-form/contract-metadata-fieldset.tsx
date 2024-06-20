import { useContractPublishMetadataFromURI } from "../hooks";
import { Flex, FormControl, Input, Textarea } from "@chakra-ui/react";
import { FileInput } from "components/shared/FileInput";
import { useImageFileOrUrl } from "hooks/useImageFileOrUrl";
import { UseFormReturn } from "react-hook-form";
import { FormErrorMessage, FormLabel, Heading, Text } from "tw-components";

interface ContractMetadataFieldsetProps {
  form: UseFormReturn<any, any>;
  metadata: ReturnType<typeof useContractPublishMetadataFromURI>;
}

export const ContractMetadataFieldset: React.FC<
  ContractMetadataFieldsetProps
> = ({ form, metadata }) => {
  return (
    <>
      <Flex direction="column" gap={2}>
        <Heading size="label.lg">Contract Metadata</Heading>
        <Text size="body.md" fontStyle="italic">
          Settings to organize and distinguish between your different contracts.
        </Text>
      </Flex>
      <Flex gap={4} direction={{ base: "column", md: "row" }}>
        <Flex flexShrink={0} flexGrow={1} maxW={{ base: "100%", md: "160px" }}>
          <FormControl
            isDisabled={!metadata.isSuccess}
            display="flex"
            flexDirection="column"
            isInvalid={
              !!form.getFieldState("contractMetadata.image", form.formState)
                .error
            }
          >
            <FormLabel>Image</FormLabel>
            <FileInput
              accept={{ "image/*": [] }}
              value={useImageFileOrUrl(form.watch("contractMetadata.image"))}
              setValue={(file) =>
                form.setValue("contractMetadata.image", file, {
                  shouldTouch: true,
                })
              }
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              transition="all 200ms ease"
            />
            <FormErrorMessage>
              {
                form.getFieldState("contractMetadata.image", form.formState)
                  .error?.message
              }
            </FormErrorMessage>
          </FormControl>
        </Flex>

        <Flex direction="column" gap={4} flexGrow={1} justify="space-between">
          <Flex gap={4} direction={{ base: "column", md: "row" }}>
            <FormControl
              isRequired
              isDisabled={!metadata.isSuccess}
              isInvalid={
                !!form.getFieldState("contractMetadata.name", form.formState)
                  .error
              }
            >
              <FormLabel>Name</FormLabel>
              <Input
                autoFocus
                variant="filled"
                {...form.register("contractMetadata.name")}
              />
              <FormErrorMessage>
                {
                  form.getFieldState("contractMetadata..name", form.formState)
                    .error?.message
                }
              </FormErrorMessage>
            </FormControl>
            {/*             {hasSymbol && ( */}
            <FormControl
              maxW={{ base: "100%", md: "200px" }}
              isInvalid={
                !!form.getFieldState("contractMetadata.symbol", form.formState)
                  .error
              }
            >
              <FormLabel>Symbol</FormLabel>
              <Input
                variant="filled"
                {...form.register("contractMetadata.symbol")}
              />
              <FormErrorMessage>
                {
                  form.getFieldState("contractMetadata.symbol", form.formState)
                    .error?.message
                }
              </FormErrorMessage>
            </FormControl>
            {/*             )} */}
          </Flex>

          <FormControl
            isDisabled={!metadata.isSuccess}
            isInvalid={
              !!form.getFieldState("description", form.formState).error
            }
          >
            <FormLabel>Description</FormLabel>
            <Textarea
              variant="filled"
              {...form.register("contractMetadata.description")}
            />
            <FormErrorMessage>
              {
                form.getFieldState(
                  "contractMetadata.description",
                  form.formState,
                ).error?.message
              }
            </FormErrorMessage>
          </FormControl>
        </Flex>
      </Flex>
    </>
  );
};
