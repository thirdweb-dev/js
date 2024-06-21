import { Box, Flex, Icon } from "@chakra-ui/react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FiPlus } from "react-icons/fi";
import { Button, Heading, Text } from "tw-components";
import { ExtensionInput } from "./extension-input";

export const DynamicContractsFieldset = () => {
  const form = useFormContext();

  const { fields, append, remove } = useFieldArray({
    name: "defaultExtensions",
    control: form.control,
  });

  return (
    <Flex gap={8} direction="column" as="fieldset">
      <Flex gap={2} direction="column">
        <Heading size="title.md">Contract extension settings</Heading>
        <Text>You can set default extensions for your contract.</Text>
      </Flex>
      <Flex flexDir="column" gap={4}>
        {fields.map((item, index) => (
          <ExtensionInput key={item.id} remove={remove} index={index} />
        ))}
        <Box>
          <Button
            type="button"
            size="sm"
            colorScheme="primary"
            borderRadius="md"
            leftIcon={<Icon as={FiPlus} />}
            onClick={() =>
              append({
                extensionName: "",
                extensionVersion: "",
                publisherAddress: "",
              })
            }
          >
            Add Extension
          </Button>
        </Box>
      </Flex>
    </Flex>
  );
};
