import { usePaymentsKycStatus } from "@3rdweb-sdk/react/hooks/usePayments";
import { Alert, AlertIcon, AlertDescription } from "@chakra-ui/react";
import { Text } from "tw-components";

export const SellerVerificationStatusRecord: Record<
  string,
  { message: string; type: "error" | "info" | "success" }
> = {
  document_expired: {
    message:
      "Your document is expired. Please provide an non-expired document.",
    type: "error",
  },
  document_failure: {
    message: "Your document verification failed. Please try again.",
    type: "error",
  },
  sanctions_failure: {
    message:
      "Your verification failed. Contact compliance@thirdweb.com for more details.",
    type: "error",
  },
  waiting: {
    message:
      "Your verification is pending, thank you for your patience! If not approved within 48 hours, please contact compliance@thirdweb.com.",
    type: "info",
  },
  success: { message: "Verification successful.", type: "success" },
};

interface KycStatusProps {
  sessionId: string;
}

export const KycStatus: React.FC<KycStatusProps> = ({ sessionId }) => {
  const { data: kycStatus } = usePaymentsKycStatus(sessionId);

  if (!kycStatus?.status) {
    return null;
  }

  return (
    <Alert
      status={
        SellerVerificationStatusRecord[kycStatus.status]?.type || "warning"
      }
      variant="left-accent"
      borderRadius="lg"
      mt={2}
    >
      <AlertIcon />
      <Text as={AlertDescription}>
        {SellerVerificationStatusRecord[kycStatus.status]?.message ||
          "Something went wrong. Contact compliance@thirdweb.com for more details."}
      </Text>
    </Alert>
  );
};
