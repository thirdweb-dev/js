import { StepsCard } from "components/dashboard/StepsCard";
import { PaymentsSettingsKyc } from "./payment-settings-kyc";
import { PaymentsSettingsKyb } from "./payment-settings-kyb";
import { usePaymentsSellerById } from "@3rdweb-sdk/react/hooks/usePayments";
import { Flex } from "@chakra-ui/react";

interface PaymentsSettingsChecklistProps {
  paymentsSellerId: string;
}

export const PaymentsSettingsChecklist: React.FC<
  PaymentsSettingsChecklistProps
> = ({ paymentsSellerId }) => {
  const { data: sellerData } = usePaymentsSellerById(paymentsSellerId);

  const kycIsInTheFuture = sellerData?.date_personal_documents_verified
    ? new Date(sellerData.date_personal_documents_verified) > new Date()
    : false;

  const steps = [
    {
      title: "Personal Identity Verification",
      description: "",
      completed: !!sellerData?.date_personal_documents_verified,
      children: sellerData && <PaymentsSettingsKyc sellerId={sellerData.id} />,
    },
    {
      title: "Business Information",
      description: "",
      completed:
        !!sellerData?.date_business_documents_verified && !kycIsInTheFuture,
      children: <PaymentsSettingsKyb />,
    },
  ];

  if (!sellerData?.id || sellerData?.has_production_access) {
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
