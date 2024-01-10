import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { OnboardingTitle } from "./Title";
import { shortenString } from "utils/usedapp-external";
import { Flex } from "@chakra-ui/react";
import { Button, TrackedLink } from "tw-components";
import { useUpdateAccount } from "@3rdweb-sdk/react/hooks/useApi";
import { useTrack } from "hooks/analytics/useTrack";

interface OnboardingLinkWalletProps {
  email: string;
  onSave: () => void;
  onBack: () => void;
}

export const OnboardingLinkWallet: React.FC<OnboardingLinkWalletProps> = ({
  email,
  onSave,
  onBack,
}) => {
  const { user } = useLoggedInUser();
  const trackEvent = useTrack();
  const updateMutation = useUpdateAccount();

  const handleSubmit = () => {
    trackEvent({
      category: "account",
      action: "linkWallet",
      label: "attempt",
      data: {
        email,
      },
    });

    updateMutation.mutate(
      {
        email,
        linkWallet: true,
      },
      {
        onSuccess: (data) => {
          if (onSave) {
            onSave();
          }

          trackEvent({
            category: "account",
            action: "linkWallet",
            label: "success",
            data,
          });
        },
        onError: (err) => {
          const error = err as Error;

          trackEvent({
            category: "account",
            action: "linkWallet",
            label: "error",
            error,
          });
        },
      },
    );
  };

  return (
    <>
      <OnboardingTitle
        heading="Linking Wallets"
        description={
          <>
            We&apos;ve noticed that there is another account associated with{" "}
            <strong>{email}</strong>. Would you like to link your wallet{" "}
            <strong>{shortenString(user?.address ?? "")}</strong> to the
            existing account? Once you agree, we will email you the details.{" "}
            <TrackedLink
              href="https://portal.thirdweb.com/account/billing/account-info"
              color="blue.500"
              category="account"
              label="learn-wallet-linking"
              isExternal
            >
              Learn more about wallet linking
            </TrackedLink>
            .
          </>
        }
      />
      <form>
        <Flex gap={8} flexDir="column" w="full">
          <Flex flexDir="column" gap={3}>
            <Button
              w="full"
              size="lg"
              fontSize="md"
              colorScheme="blue"
              type="button"
              onClick={handleSubmit}
              isLoading={updateMutation.isLoading}
              isDisabled={updateMutation.isLoading}
            >
              Yes, link them
            </Button>
            <Button
              w="full"
              size="lg"
              fontSize="md"
              variant="outline"
              onClick={onBack}
              isDisabled={updateMutation.isLoading}
            >
              Use another email
            </Button>
          </Flex>
        </Flex>
      </form>
    </>
  );
};
