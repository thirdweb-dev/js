import {
  Flex,
  FormControl,
  IconButton,
  Icon,
  Divider,
  Select,
  Skeleton,
  Input,
} from "@chakra-ui/react";
import React from "react";
import { useFormContext } from "react-hook-form";
import { FiTrash } from "react-icons/fi";
import { FormLabel } from "tw-components";
import { useAllVersions, usePublishedContractsQuery } from "../hooks";

interface ExtensionInputProps {
  index: number;
  remove: (index: number) => void;
}

export const ExtensionInput: React.FC<ExtensionInputProps> = ({
  index,
  remove,
}) => {
  const form = useFormContext();

  const publishedContractsQuery = usePublishedContractsQuery(
    form.watch(`defaultExtensions.${index}.publisherAddress`),
  );

  const allVersions = useAllVersions(
    form.watch(`defaultExtensions.${index}.publisherAddress`),
    form.watch(`defaultExtensions.${index}.extensionName`),
  );

  return (
    <Flex flexDir="column" gap={2}>
      <Flex
        w="full"
        gap={{ base: 4, md: 2 }}
        flexDir={{ base: "column", md: "row" }}
      >
        <FormControl
          as={Flex}
          flexDir="column"
          gap={1}
          isInvalid={
            !!form.getFieldState(
              `defaultExtensions.${index}.publisherAddress`,
              form.formState,
            ).error
          }
        >
          <FormLabel textTransform="capitalize">Publisher</FormLabel>
          <Input
            placeholder="Address or ENS"
            {...form.register(`defaultExtensions.${index}.publisherAddress`)}
          />
        </FormControl>
        <FormControl as={Flex} flexDir="column" gap={1}>
          <FormLabel textTransform="capitalize">Extension Name</FormLabel>
          <Skeleton
            isLoaded={
              !!publishedContractsQuery.data ||
              !publishedContractsQuery.isFetching
            }
            borderRadius="lg"
          >
            <Select
              isDisabled={(publishedContractsQuery?.data || []).length === 0}
              {...form.register(`defaultExtensions.${index}.extensionName`)}
              placeholder={
                publishedContractsQuery.isFetched &&
                (publishedContractsQuery?.data || []).length === 0
                  ? "No extensions found"
                  : "Select extension"
              }
            >
              {publishedContractsQuery?.data?.map(({ id }) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </Select>
          </Skeleton>
        </FormControl>

        <FormControl as={Flex} flexDir="column" gap={1}>
          <FormLabel textTransform="capitalize">Extension Version</FormLabel>
          <Skeleton
            isLoaded={!!allVersions.data || !allVersions.isFetching}
            borderRadius="lg"
          >
            <Select
              w="full"
              isDisabled={!allVersions.data}
              {...form.register(`defaultExtensions.${index}.extensionVersion`)}
              borderRadius="lg"
            >
              <option value="">Always latest</option>
              {allVersions?.data?.map(({ version }) => (
                <option key={version} value={version}>
                  {version}
                </option>
              ))}
            </Select>
          </Skeleton>
        </FormControl>
        <IconButton
          icon={<Icon as={FiTrash} boxSize={5} />}
          aria-label="Remove row"
          onClick={() => remove(index)}
          alignSelf="end"
        />
      </Flex>
      <Divider />
    </Flex>
  );
};
