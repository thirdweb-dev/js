import {
  Flex,
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useColorMode,
} from "@chakra-ui/react";
import { UseFormHandleSubmit, UseFormRegister } from "react-hook-form";
import { Button } from "tw-components";

export type EmailInputs = {
  email: string;
};

interface EmailInputProps {
  register: UseFormRegister<EmailInputs>;
  handleSubmit: UseFormHandleSubmit<EmailInputs>;
  onSubmit: (data: EmailInputs) => Promise<void>;
  isDisabled?: boolean;
  isLoading?: boolean;
  buttonText?: string;
}

export const EmailInput: React.FC<EmailInputProps> = ({
  handleSubmit,
  onSubmit,
  register,
  isDisabled = false,
  isLoading = false,
  buttonText,
}) => {
  const { colorMode } = useColorMode();
  return (
    <Flex
      flexDir="column"
      as="form"
      alignItems="start"
      onSubmit={handleSubmit(onSubmit)}
    >
      <VStack alignItems="start" w={{ base: "full", md: "full" }}>
        <FormControl isRequired>
          <InputGroup size="md">
            <Input
              type="email"
              id="email"
              variant="outline"
              placeholder="Enter your email"
              {...register("email")}
            />
            <InputRightElement w="auto">
              <Button
                type="submit"
                roundedLeft="none"
                isDisabled={isDisabled}
                isLoading={isLoading}
                bg={colorMode === "dark" ? "white" : "black"}
                _hover={{
                  bg: colorMode === "dark" ? "white" : "black",
                  opacity: 0.8,
                }}
                _loading={{
                  bg: colorMode === "dark" ? "white" : "black",
                  color: colorMode === "dark" ? "black" : "white",
                }}
                color={colorMode === "dark" ? "black" : "white"}
              >
                {buttonText}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
      </VStack>
    </Flex>
  );
};
