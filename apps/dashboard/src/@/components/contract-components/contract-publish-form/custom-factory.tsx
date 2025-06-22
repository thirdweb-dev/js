import {
  Box,
  Flex,
  FormControl,
  IconButton,
  Input,
  ListItem,
  UnorderedList,
} from "@chakra-ui/react";
import type { Abi } from "abitype";
import { Button } from "chakra/button";
import { Heading } from "chakra/heading";
import { Text } from "chakra/text";
import { PlusIcon, TrashIcon } from "lucide-react";
import { type Dispatch, type SetStateAction, useEffect } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import type { ThirdwebClient } from "thirdweb";
import { SingleNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { useCustomFactoryAbi } from "@/hooks/contract-hooks";
import { AbiSelector } from "./abi-selector";

interface CustomFactoryProps {
  setCustomFactoryAbi: Dispatch<SetStateAction<Abi>>;
  client: ThirdwebClient;
}

export const CustomFactory: React.FC<CustomFactoryProps> = ({
  setCustomFactoryAbi,
  client,
}) => {
  const form = useFormContext();

  const customFactoryAbi = useCustomFactoryAbi(
    client,
    form.watch("customFactoryAddresses[0].value"),
    form.watch("customFactoryAddresses[0].key"),
  );

  // FIXME: all of this logic needs to be reworked
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (customFactoryAbi?.data) {
      setCustomFactoryAbi(customFactoryAbi.data);
    }
  }, [customFactoryAbi, setCustomFactoryAbi]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "customFactoryAddresses",
  });

  // FIXME: all of this logic needs to be reworked
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (fields.length === 0) {
      append({ key: 1, value: "" }, { shouldFocus: false });
    }
  }, [fields, append]);

  return (
    <Flex flexDir="column" gap={12} pb={0} px={0}>
      <UnorderedList>
        <Text as={ListItem}>
          Use this if you want to invoke your own function with custom logic
          when users deploy your contract.
        </Text>
        <Text as={ListItem}>
          You need to have factory contracts pre-deployed to all networks that
          you want to support.
        </Text>
      </UnorderedList>
      <Flex flexDir="column" gap={4}>
        <Flex flexDir="column" gap={2}>
          <Heading size="title.md">Factory contract addresses</Heading>
          <Text>
            Paste the contract address of your factory contracts. Your contract
            can be deployed only to networks with valid factory address.
          </Text>
        </Flex>
        {fields.map((field, index) => (
          <div key={field.id}>
            <FormControl as={Flex} gap={4} isRequired>
              <Box w={{ base: "full", md: "40%" }}>
                <Controller
                  control={form.control}
                  name={`customFactoryAddresses[${index}].key`}
                  render={({ field: _field }) => {
                    return (
                      <SingleNetworkSelector
                        chainId={_field.value}
                        client={client}
                        onChange={(value) => {
                          _field.onChange(value);
                        }}
                      />
                    );
                  }}
                />
              </Box>
              <Box w="full">
                <Input
                  isRequired
                  {...form.register(`customFactoryAddresses[${index}].value`)}
                  placeholder="Factory contract address"
                />
              </Box>
              <IconButton
                aria-label="Remove row"
                icon={<TrashIcon className="size-5" />}
                isDisabled={fields.length === 1 || form.formState.isSubmitting}
                onClick={() => remove(index)}
              />
            </FormControl>
          </div>
        ))}
        <div>
          <Button
            borderRadius="md"
            colorScheme="primary"
            leftIcon={<PlusIcon className="size-5" />}
            onClick={() => append({ key: "", value: "" })}
            size="sm"
            type="button"
          >
            Add Network
          </Button>
        </div>
      </Flex>
      <Flex flexDir="column" gap={4}>
        <Flex flexDir="column" gap={2}>
          <Heading size="title.md">Factory function</Heading>
          <Text>Choose the factory function to deploy your contracts.</Text>
        </Flex>
        <FormControl isRequired>
          {customFactoryAbi?.data ? (
            <AbiSelector
              abi={customFactoryAbi.data}
              defaultValue="deployProxyByImplementation"
              onChange={(selectedFn) =>
                form.setValue(
                  "factoryDeploymentData.customFactoryInput.factoryFunction",
                  selectedFn,
                )
              }
              value={form.watch(
                "factoryDeploymentData.customFactoryInput.factoryFunction",
              )}
            />
          ) : (
            <Text fontStyle="italic">
              Custom factory ABI not found. Please provide a valid imported
              contract on the previous step.
            </Text>
          )}
        </FormControl>
      </Flex>
    </Flex>
  );
};
