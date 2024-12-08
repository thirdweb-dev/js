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
import type { AbiParameter } from "abitype";
import { TrashIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { FormLabel } from "tw-components";
import { useAllVersions, usePublishedContractsQuery } from "../../hooks";

interface RefContractImplInputProps {
  param: AbiParameter;
  index: number;
  remove: (index: number) => void;
}

export const RefContractImplInput: React.FC<RefContractImplInputProps> = ({
  param,
  index,
  remove,
}) => {
  const form = useFormContext();

  const publishedContractsQuery = usePublishedContractsQuery(
    form.watch(
      `implConstructorParams.${param.name ? param.name : "*"}.dynamicValue.refContracts.${index}.publisherAddress`,
    ),
  );

  const allVersions = useAllVersions(
    form.watch(
      `implConstructorParams.${param.name ? param.name : "*"}.dynamicValue.refContracts.${index}.publisherAddress`,
    ),
    form.watch(
      `implConstructorParams.${param.name ? param.name : "*"}.dynamicValue.refContracts.${index}.contractId`,
    ),
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
              `implConstructorParams.${param.name ? param.name : "*"}.dynamicValue.refContracts.${index}.publisherAddress`,
              form.formState,
            ).error
          }
        >
          <FormLabel textTransform="capitalize">Publisher</FormLabel>
          <Input
            placeholder="Address or ENS"
            {...form.register(
              `implConstructorParams.${param.name ? param.name : "*"}.dynamicValue.refContracts.${index}.publisherAddress`,
            )}
          />
        </FormControl>
        <FormControl as={Flex} flexDir="column" gap={1}>
          <FormLabel textTransform="capitalize">Contract Name</FormLabel>
          <Skeleton
            isLoaded={
              !!publishedContractsQuery.data ||
              !publishedContractsQuery.isFetching
            }
            borderRadius="lg"
          >
            <Select
              isDisabled={(publishedContractsQuery?.data || []).length === 0}
              {...form.register(
                `implConstructorParams.${param.name ? param.name : "*"}.dynamicValue.refContracts.${index}.contractId`,
              )}
              placeholder={
                publishedContractsQuery.isFetched &&
                (publishedContractsQuery?.data || []).length === 0
                  ? "No extensions found"
                  : "Select extension"
              }
            >
              {publishedContractsQuery?.data?.map(({ contractId }) => (
                <option key={contractId} value={contractId}>
                  {contractId}
                </option>
              ))}
            </Select>
          </Skeleton>
        </FormControl>

        <FormControl as={Flex} flexDir="column" gap={1}>
          <FormLabel textTransform="capitalize">Contract Version</FormLabel>
          <Skeleton
            isLoaded={!!allVersions.data || !allVersions.isFetching}
            borderRadius="lg"
          >
            <Select
              w="full"
              isDisabled={!allVersions.data}
              {...form.register(
                `implConstructorParams.${param.name ? param.name : "*"}.dynamicValue.refContracts.${index}.version`,
              )}
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

        <FormControl
          as={Flex}
          flexDir="column"
          gap={1}
          isInvalid={
            !!form.getFieldState(
              `implConstructorParams.${param.name ? param.name : "*"}.dynamicValue.refContracts.${index}.salt`,
              form.formState,
            ).error
          }
        >
          <FormLabel textTransform="capitalize">Salt</FormLabel>
          <Input
            placeholder="Salt (optional)"
            {...form.register(
              `implConstructorParams.${param.name ? param.name : "*"}.dynamicValue.refContracts.${index}.salt`,
            )}
          />
        </FormControl>

        <IconButton
          icon={<Icon as={TrashIcon} boxSize={5} />}
          aria-label="Remove row"
          onClick={() => remove(index)}
          alignSelf="end"
        />
      </Flex>
      <Divider />
    </Flex>
  );
};
