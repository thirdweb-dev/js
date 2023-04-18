import {
  Flex,
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useColorMode,
} from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { useForm } from "react-hook-form";
import { Button, Text } from "tw-components";

interface ClaimAirdropProps {
  canClaim: boolean;
  claim: (email: string) => void;
  isClaiming: boolean;
  handleEmailSubmit: (email: string) => void;
}

type Inputs = {
  email: string;
};
export const ClaimAirdrop: React.FC<ClaimAirdropProps> = ({
  canClaim,
  claim,
  isClaiming,
  handleEmailSubmit,
}) => {
  const { register, handleSubmit, reset } = useForm<Inputs>();

  const onSubmit = async (data: Inputs) => {
    if (!data.email) {
      return;
    }
    if (!canClaim) {
      handleEmailSubmit(data.email);
      reset();
    } else {
      claim(data.email);
    }
  };

  const { colorMode } = useColorMode();
  return (
    <Flex direction="column" gap={4} justifyContent="center">
      {canClaim ? (
        <Flex
          gap={2}
          alignItems="center"
          justifyContent={{
            base: "center",
            lg: "flex-start",
          }}
        >
          <Text
            fontWeight="bold"
            fontSize="19px"
            color={"initial"}
            mt={4}
            mb={2}
          >
            You are eligible to claim 1 pack!
          </Text>
          <ChakraNextImage
            alt="checkmark"
            alignSelf="center"
            src={require("public/assets/bear-market-airdrop/checkmark.svg")}
          />
        </Flex>
      ) : (
        <Text fontWeight="bold" fontSize="19px" color={"initial"} mt={4} mb={2}>
          You&apos;re unfortunately not eligible to claim.
        </Text>
      )}
      <Flex
        flexDir="column"
        as="form"
        mt={2}
        mb={2}
        alignItems="start"
        onSubmit={handleSubmit(onSubmit)}
      >
        <VStack alignItems="start" w={{ base: "full", md: "auto" }}>
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
                  isDisabled={isClaiming}
                  isLoading={isClaiming}
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
                  {canClaim ? "Claim" : "Subscribe"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          {!canClaim && (
            <Flex gap={2}>
              <Text fontSize="14px" fontWeight="semibold" mt={2}>
                Subscribe to thirdweb&apos;s newsletter for the latest updates.
              </Text>
              <ChakraNextImage
                src={require("public/assets/bear-market-airdrop/email-icon.svg")}
                alt="Bear market builders hero image"
              />
            </Flex>
          )}
          <Flex alignItems="center" gap={2} mb={8}>
            {canClaim && (
              <Text>
                Ensure your email is correct as it will be used to send you
                rewards.
              </Text>
            )}
          </Flex>
        </VStack>
      </Flex>
    </Flex>
  );
};
