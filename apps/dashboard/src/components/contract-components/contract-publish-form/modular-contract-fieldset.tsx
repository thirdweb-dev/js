import { Box, Flex, Icon } from "@chakra-ui/react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FiPlus } from "react-icons/fi";
import { Button, Heading, Text } from "tw-components";
import { ModuleInput } from "./module-input";

export const ModularContractsFieldset = () => {
  const form = useFormContext();

  const { fields, append, remove } = useFieldArray({
    name: "defaultModules",
    control: form.control,
  });

  return (
    <Flex gap={8} direction="column" as="fieldset">
      <Flex gap={2} direction="column">
        <Heading size="title.md">Contract module settings</Heading>
        <Text>You can set default modules for your contract.</Text>
      </Flex>
      <Flex flexDir="column" gap={4}>
        {fields.map((item, index) => (
          <ModuleInput key={item.id} remove={remove} index={index} />
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
                moduleName: "",
                moduleVersion: "",
                publisherAddress: "",
              })
            }
          >
            Add Module
          </Button>
        </Box>
      </Flex>
    </Flex>
  );
};
