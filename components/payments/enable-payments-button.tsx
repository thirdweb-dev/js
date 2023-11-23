import {
  hasPaymentsDetectedExtensions,
  usePaymentsEnabledContracts,
  usePaymentsRegisterContract,
} from "@3rdweb-sdk/react/hooks/usePayments";
import { Flex } from "@chakra-ui/react";
import { useContract } from "@thirdweb-dev/react";
import { useTrack } from "hooks/analytics/useTrack";
import { useChainSlug } from "hooks/chains/chainSlug";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { Button } from "tw-components";

interface EnablePaymentsButtonProps {
  contractAddress: string;
  chainId: number;
}

export const EnablePaymentsButton: React.FC<EnablePaymentsButtonProps> = ({
  contractAddress,
  chainId,
}) => {
  const { mutate: registerContract, isLoading } = usePaymentsRegisterContract();
  const { data: paymentEnabledContracts } = usePaymentsEnabledContracts();
  const { contract } = useContract(contractAddress);
  const hasDetectedExtensions = hasPaymentsDetectedExtensions(contract);

  const contractIsEnabled = useMemo(() => {
    return paymentEnabledContracts?.some(
      (paymentContract) =>
        paymentContract.address.toLowerCase() === contractAddress.toLowerCase(),
    );
  }, [paymentEnabledContracts, contractAddress]);

  const router = useRouter();
  const trackEvent = useTrack();
  const chainSlug = useChainSlug(chainId);

  const { onSuccess, onError } = useTxNotifications(
    "Successfully enabled payments",
    "Failed to enable payments",
  );

  return (
    <Flex justifyContent="end">
      {contractIsEnabled ? (
        <Button colorScheme="blackAlpha" size="sm" isDisabled w="full">
          Payments Enabled
        </Button>
      ) : (
        <Button
          colorScheme="blackAlpha"
          size="sm"
          onClick={() => {
            trackEvent({
              category: "payments",
              action: "enable-payments",
              label: "attempt",
            });
            registerContract(
              {
                chain: `${chainId}`,
                contractAddress,
                contractType: hasDetectedExtensions
                  ? "THIRDWEB"
                  : "CUSTOM_CONTRACT",
              },
              {
                onSuccess: () => {
                  trackEvent({
                    category: "payments",
                    action: "enable-payments",
                    label: "success",
                  });
                  router.push(
                    `/${chainSlug}/${contractAddress}/payments`,
                    undefined,
                    { scroll: true },
                  );
                  onSuccess();
                },
                onError: (error) => {
                  trackEvent({
                    category: "payments",
                    action: "enable-payments",
                    label: "error",
                    error,
                  });
                  onError(error);
                },
              },
            );
          }}
          px={6}
          w="full"
          isLoading={isLoading}
        >
          Enable Payments
        </Button>
      )}
    </Flex>
  );
};
