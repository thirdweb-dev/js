import { SolidityInputProps } from ".";
import { ButtonGroup, Flex } from "@chakra-ui/react";
import { Button } from "tw-components";

export const SolidityBoolInput: React.FC<SolidityInputProps> = ({
  formContext: form,
  ...inputProps
}) => {
  const { name } = inputProps;
  const inputName = name as string;
  const watchInput = form.watch(inputName);
  return (
    <Flex>
      <ButtonGroup isAttached size="sm" colorScheme="blue">
        <Button
          onClick={() => form.setValue(inputName, "true")}
          borderColor="borderColor"
          variant={watchInput === "true" ? "solid" : "outline"}
        >
          True
        </Button>
        <Button
          onClick={() => form.setValue(inputName, "false")}
          borderColor="borderColor"
          variant={watchInput === "false" ? "solid" : "outline"}
        >
          False
        </Button>
      </ButtonGroup>
    </Flex>
  );
};
