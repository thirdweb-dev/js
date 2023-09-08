import { Account, useAccount } from "@3rdweb-sdk/react/hooks/useApi";
import { useDisclosure } from "@chakra-ui/react";
import { useUser } from "@thirdweb-dev/react";
import { AccountForm } from "components/settings/Account/AccountForm";
import { useEffect, useState } from "react";
import { Heading, Text } from "tw-components";
import { OnboardingModal } from "./Modal";

export const Onboarding: React.FC = () => {
  const meQuery = useAccount();
  const { isLoggedIn } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    onClose();
  };

  useEffect(() => {
    // open modal only when user hasn't onboarded and not saved already
    if (!saved && isLoggedIn && meQuery?.data && !meQuery.data.onboardedAt) {
      onOpen();
    }
  }, [isLoggedIn, meQuery, onOpen, saved]);

  return (
    <OnboardingModal isOpen={isOpen} onClose={handleSave}>
      <Heading size="title.md" mb={6} textAlign="center">
        Welcome to <strong>thirdweb</strong>
      </Heading>

      <Text size="body.md" fontWeight="medium" mb={2}>
        {isLoggedIn
          ? "Enter a name and email to manage your billing info, and receive our latest product updates."
          : "Sign in with your wallet"}
      </Text>

      <AccountForm
        account={meQuery.data as Account}
        showSubscription
        buttonText="Continue to Dashboard"
        trackingCategory="onboarding"
        padded={false}
        optional
        buttonProps={{
          w: "full",
          size: "lg",
          fontSize: "md",
        }}
        onSave={handleSave}
      />
    </OnboardingModal>
  );
};
