import { Box, Flex, Icon } from "@chakra-ui/react";
import { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FiPlus } from "react-icons/fi";
import { Button, Heading, Text } from "tw-components";
import { ExternalLinksInput } from "./external-links-input";

export const ExternalLinksFieldset = () => {
  const form = useFormContext();

  const { fields, append, remove } = useFieldArray({
    name: "externalLinks",
    control: form.control,
  });

  // FIXME: all of this logic needs to be reworked
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (fields.length === 0) {
      append(
        {
          name: "",
          url: "",
        },
        { shouldFocus: false },
      );
    }
  }, [fields, append]);

  return (
    <Flex gap={8} direction="column" as="fieldset">
      <Flex gap={2} direction="column">
        <Heading size="title.md">Resources</Heading>
        <Text>Provide links to docs, usage guides etc. for the contract.</Text>
      </Flex>
      <Flex flexDir="column" gap={4}>
        {fields.map((item, index) => (
          <ExternalLinksInput key={item.id} remove={remove} index={index} />
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
                name: "",
                url: "",
              })
            }
          >
            Add Resource
          </Button>
        </Box>
      </Flex>
    </Flex>
  );
};
