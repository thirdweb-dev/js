import { Flex } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { EmailInput } from "components/bear-market-airdrop/Email/EmailInput";
import { useForm } from "react-hook-form";
import { Text } from "tw-components";

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
      <EmailInput
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        register={register}
        isDisabled={isClaiming}
        isLoading={isClaiming}
        buttonText={canClaim ? "Claim" : "Subscribe"}
      />
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
      {canClaim && (
        <>
          <Text>
            Ensure your email is correct as it will be used to send you rewards.
            We&apos;ll also subscribe you to our newsletter for the latest
            updates.
          </Text>
        </>
      )}
    </Flex>
  );
};
