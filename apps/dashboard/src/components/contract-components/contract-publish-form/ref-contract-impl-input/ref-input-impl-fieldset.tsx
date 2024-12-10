import { Box, Flex, Icon } from "@chakra-ui/react";
import type { AbiParameter } from "abitype";
import { PlusIcon } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button, Text } from "tw-components";
import { RefContractImplInput } from "./ref-input-impl";

interface RefInputImplFieldsetProps {
  param: AbiParameter;
}

export const RefInputImplFieldset: React.FC<RefInputImplFieldsetProps> = ({
  param,
}) => {
  const form = useFormContext();

  const { fields, append, remove } = useFieldArray({
    name: `implConstructorParams.${param.name ? param.name : "*"}.dynamicValue.refContracts`,
    control: form.control,
  });

  return (
    <Flex gap={8} direction="column" as="fieldset">
      <Flex gap={2} direction="column">
        <Text>Set ref contract for this param.</Text>
      </Flex>
      <Flex flexDir="column" gap={4}>
        {fields.map((item, index) => (
          <RefContractImplInput
            key={item.id}
            remove={remove}
            index={index}
            param={param}
          />
        ))}
        <Box>
          <Button
            type="button"
            size="sm"
            colorScheme="primary"
            borderRadius="md"
            leftIcon={<Icon as={PlusIcon} />}
            isDisabled={param.type === "address" && fields.length >= 1}
            onClick={() =>
              append({
                contractId: "",
                version: "",
                publisherAddress: "",
                salt: "",
              })
            }
          >
            Add Ref
          </Button>
        </Box>
      </Flex>
    </Flex>
  );
};
