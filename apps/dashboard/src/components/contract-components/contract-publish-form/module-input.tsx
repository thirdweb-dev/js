import {
  Divider,
  Flex,
  FormControl,
  Icon,
  IconButton,
  Input,
  Select,
  Skeleton,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { FiTrash } from "react-icons/fi";
import { FormLabel } from "tw-components";
import { useAllVersions, usePublishedContractsQuery } from "../hooks";

interface ModuleInputProps {
  index: number;
  remove: (index: number) => void;
}

export const ModuleInput: React.FC<ModuleInputProps> = ({ index, remove }) => {
  const form = useFormContext();
  const feature = "ModularModule";

  const publishedContractsQuery = usePublishedContractsQuery(
    form.watch(`defaultModules.${index}.publisherAddress`),
    feature,
  );

  const allVersions = useAllVersions(
    form.watch(`defaultModules.${index}.publisherAddress`),
    form.watch(`defaultModules.${index}.moduleName`),
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
              `defaultModules.${index}.publisherAddress`,
              form.formState,
            ).error
          }
        >
          <FormLabel textTransform="capitalize">Publisher</FormLabel>
          <Input
            placeholder="Address or ENS"
            {...form.register(`defaultModules.${index}.publisherAddress`)}
          />
        </FormControl>
        <FormControl as={Flex} flexDir="column" gap={1}>
          <FormLabel textTransform="capitalize">Module Name</FormLabel>
          <Skeleton
            isLoaded={
              !!publishedContractsQuery.data ||
              !publishedContractsQuery.isFetching
            }
            borderRadius="lg"
          >
            <Select
              isDisabled={(publishedContractsQuery?.data || []).length === 0}
              {...form.register(`defaultModules.${index}.moduleName`)}
              placeholder={
                publishedContractsQuery.isFetched &&
                (publishedContractsQuery?.data || []).length === 0
                  ? "No modules found"
                  : "Select module"
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
          <FormLabel textTransform="capitalize">Module Version</FormLabel>
          <Skeleton
            isLoaded={!!allVersions.data || !allVersions.isFetching}
            borderRadius="lg"
          >
            <Select
              w="full"
              isDisabled={!allVersions.data}
              {...form.register(`defaultModules.${index}.moduleVersion`)}
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
