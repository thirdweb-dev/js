import { usePaymentsGetVerificationSession } from "@3rdweb-sdk/react/hooks/usePayments";
import { Box, Flex, ListItem, UnorderedList } from "@chakra-ui/react";
import { loadStripe } from "@stripe/stripe-js";
import { Button, Text } from "tw-components";
import { KycStatus } from "./kyc-status";
import { initialize as initTrench2 } from "@trytrench/sdk";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
);

interface PaymentsSettingsKycProps {
  sellerId: string;
}

export const PaymentsSettingsKyc: React.FC<PaymentsSettingsKycProps> = ({
  sellerId,
}) => {
  const { data: verificationSession, isLoading: isVerificationSessionLoading } =
    usePaymentsGetVerificationSession(sellerId);

  const handleSubmit = async () => {
    const stripe = await stripePromise;
    if (!verificationSession?.clientSecret) {
      console.error("Missing client secret.");
      return;
    }

    if (process.env.NEXT_PUBLIC_NODE_ENV === "production") {
      try {
        await initTrench2(
          process.env.NEXT_PUBLIC_TRENCH_2_API_ENDPOINT as string,
          verificationSession.id,
        );
      } catch (e) {
        console.error(`Failed to initialize trench: ${e}`);
      }
    }

    if (stripe) {
      const result = await stripe.verifyIdentity(
        verificationSession.clientSecret,
      );
      if (result.error) {
        console.error(result.error.message);
      }
    }
  };

  return (
    <Flex flexDir="column" gap={3}>
      <Text color="faded">
        If your company is not publicly traded, the individual that performs
        this check must
      </Text>
      <UnorderedList>
        <Text as={ListItem}>
          Directly or indirectly own 25% or more of the business
        </Text>
        <Text as={ListItem}>
          <Text as="span">
            Be a single individual with significant responsibility that controls
            and directs this business
          </Text>{" "}
          <Text color="faded" as="span">
            (e.g. executive officer, director, partner, manager, etc.)
          </Text>
        </Text>
      </UnorderedList>
      <Box>
        <Button
          colorScheme="primary"
          isLoading={isVerificationSessionLoading}
          onClick={handleSubmit}
        >
          Verify Personal Information
        </Button>
      </Box>
      {verificationSession?.id && (
        <KycStatus sessionId={verificationSession.id} />
      )}
    </Flex>
  );
};
