import { useCustomFactoryAbi } from "../hooks";
import { NetworkDropdown } from "./NetworkDropdown";
import { AbiSelector } from "./abi-selector";
import {
  Box,
  Flex,
  FormControl,
  Icon,
  IconButton,
  Input,
  ListItem,
  UnorderedList,
} from "@chakra-ui/react";
import { Abi } from "@thirdweb-dev/sdk";
import { Dispatch, SetStateAction, useEffect } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { FiPlus, FiTrash } from "react-icons/fi";
import { Button, Heading, Text } from "tw-components";

interface CustomFactoryProps {
  setCustomFactoryAbi: Dispatch<SetStateAction<Abi>>;
}

export const CustomFactory: React.FC<CustomFactoryProps> = ({
  setCustomFactoryAbi,
}) => {
  const form = useFormContext();

  const customFactoryAbi = useCustomFactoryAbi(
    form.watch("customFactoryAddresses[0].value"),
    form.watch("customFactoryAddresses[0].key"),
  );

  useEffect(() => {
    if (customFactoryAbi?.data) {
      setCustomFactoryAbi(customFactoryAbi.data);
    }
  }, [customFactoryAbi, setCustomFactoryAbi]);

  const { fields, append, remove } = useFieldArray({
    name: "customFactoryAddresses",
    control: form.control,
  });

  useEffect(() => {
    if (fields.length === 0) {
      append({ key: 1, value: "" }, { shouldFocus: false });
    }
  }, [fields, append, form]);

  return (
    <Flex px={0} pb={0} flexDir="column" gap={12}>
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
            <FormControl isRequired as={Flex} gap={4}>
              <Box w={{ base: "full", md: "30%" }}>
                <Controller
                  name={`customFactoryAddresses[${index}].key`}
                  control={form.control}
                  render={({ field: _field }) => (
                    <NetworkDropdown
                      {..._field}
                      onSingleChange={(value) => {
                        _field.onChange(value);
                      }}
                      value={_field.value}
                    />
                  )}
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
                isDisabled={fields.length === 1 || form.formState.isSubmitting}
                icon={<Icon as={FiTrash} boxSize={5} />}
                aria-label="Remove row"
                onClick={() => remove(index)}
              />
            </FormControl>
          </div>
        ))}
        <Box>
          <Button
            type="button"
            size="sm"
            colorScheme="primary"
            borderRadius="md"
            leftIcon={<Icon as={FiPlus} />}
            onClick={() => append({ key: "", value: "" })}
          >
            Add Network
          </Button>
        </Box>
      </Flex>
      <Flex flexDir="column" gap={4}>
        <Flex flexDir="column" gap={2}>
          <Heading size="title.md">Factory function</Heading>
          <Text>Choose the factory function to deploy your contracts.</Text>
        </Flex>
        <FormControl isRequired>
          {customFactoryAbi?.data ? (
            <AbiSelector
              defaultValue="deployProxyByImplementation"
              abi={customFactoryAbi.data}
              value={form.watch(
                `factoryDeploymentData.customFactoryInput.factoryFunction`,
              )}
              onChange={(selectedFn) =>
                form.setValue(
                  `factoryDeploymentData.customFactoryInput.factoryFunction`,
                  selectedFn,
                )
              }
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
