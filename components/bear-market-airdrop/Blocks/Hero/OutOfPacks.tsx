import { Flex } from "@chakra-ui/react";
import {
  EmailInput,
  EmailInputs,
} from "components/bear-market-airdrop/Email/EmailInput";
import { useForm } from "react-hook-form";
import { Heading, Text } from "tw-components";

interface OutOfPacksProps {
  handleEmailSubmit: (email: string) => void;
}

export const OutOfPacks: React.FC<OutOfPacksProps> = ({
  handleEmailSubmit,
}) => {
  const { register, handleSubmit, reset } = useForm<EmailInputs>();

  const onSubmit = async (data: EmailInputs) => {
    if (!data.email) {
      return;
    }
    handleEmailSubmit(data.email);
    reset();
  };

  return (
    <Flex direction="column" justifyContent="center">
      <Heading>You&apos;ve missed the airdrop.</Heading>
      <Flex justifyContent="start" alignItems="center" mb={4}>
        <Text fontSize="14px" fontWeight="semibold" mt={2}>
          Make sure you don&apos;t miss the next one by subscribing to our
          newsletter.
        </Text>
      </Flex>
      <EmailInput
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        register={register}
        buttonText="Subscribe"
      />
    </Flex>
  );
};
