import { StepsCard } from "components/dashboard/StepsCard";
import { PaymentsSettingsKyc } from "./payment-settings-kyc";
import { PaymentsSettingsKyb } from "./payment-settings-kyb";
import { usePaymentsSellerByAccountId } from "@3rdweb-sdk/react/hooks/usePayments";
import { Flex } from "@chakra-ui/react";

interface PaymentsSettingsChecklistProps {
  accountId: string;
}

export const PaymentsSettingsChecklist: React.FC<
  PaymentsSettingsChecklistProps
> = ({ accountId }) => {
  const { data: sellerData } = usePaymentsSellerByAccountId(accountId);

  const steps = [
    {
      title: "Personal Identity Verification",
      description: "",
      completed: !!sellerData?.date_personal_documents_verified,
      /*  completed: true, */
      children: sellerData && <PaymentsSettingsKyc sellerId={sellerData.id} />,
    },
    {
      title: "Business Information",
      description: "",
      completed: !!sellerData?.date_business_documents_verified,
      children: <PaymentsSettingsKyb />,
    },
  ];

  if (!sellerData?.id) {
    return null;
  }

  return (
    <Flex w={{ base: "full", xl: "70%" }}>
      <StepsCard
        title="Complete and verify your seller profile"
        steps={steps}
        delay={0}
      />
    </Flex>
  );
};
