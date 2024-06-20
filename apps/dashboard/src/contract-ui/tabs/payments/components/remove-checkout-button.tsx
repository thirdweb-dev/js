import { usePaymentsRemoveCheckout } from "@3rdweb-sdk/react/hooks/usePayments";
import { Icon, IconButton } from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { FiTrash2 } from "react-icons/fi";

interface RemoveCheckoutButtonProps {
  contractAddress: string;
  checkoutId: string;
}

export const RemoveCheckoutButton: React.FC<RemoveCheckoutButtonProps> = ({
  contractAddress,
  checkoutId,
}) => {
  const trackEvent = useTrack();
  const { mutate: removeCheckout, isLoading } =
    usePaymentsRemoveCheckout(contractAddress);
  const { onSuccess, onError } = useTxNotifications(
    "Successfully removed checkout",
    "Failed to remove checkout",
  );

  return (
    <IconButton
      variant="outline"
      icon={<Icon as={FiTrash2} />}
      aria-label="Remove checkout"
      isLoading={isLoading}
      onClick={() => {
        trackEvent({
          category: "payments",
          action: "remove-checkout",
          label: "attempt",
        });
        removeCheckout(
          { checkoutId },
          {
            onSuccess: () => {
              onSuccess();
              trackEvent({
                category: "payments",
                action: "remove-checkout",
                label: "success",
              });
            },
            onError: (error) => {
              onError(error);
              trackEvent({
                category: "payments",
                action: "remove-checkout",
                label: "error",
                error,
              });
            },
          },
        );
      }}
    />
  );
};
