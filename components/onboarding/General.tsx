import { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { AccountForm } from "components/settings/Account/AccountForm";
import { OnboardingTitle } from "./Title";
import { Flex, HStack } from "@chakra-ui/react";
import { Button, Text } from "tw-components";
import { useDisconnect, useLogout } from "@thirdweb-dev/react";

type OnboardingGeneralProps = {
  account: Account;
  onSave: (email: string) => void;
};

export const OnboardingGeneral: React.FC<OnboardingGeneralProps> = ({
  account,
  onSave,
}) => {
  const { logout } = useLogout();
  const disconnect = useDisconnect();

  const handleLogout = async () => {
    await logout();
    disconnect();
  };

  return (
    <>
      <OnboardingTitle
        heading="Create your thirdweb account"
        description="Start building web3 apps and games, faster."
      />

      <Flex flexDir="column" gap={4}>
        <AccountForm
          showSubscription
          optional
          account={account}
          buttonText="Get Started for Free"
          trackingCategory="onboarding"
          padded={false}
          buttonProps={{
            w: "full",
            size: "lg",
            fontSize: "md",
            variant: "inverted",
          }}
          onSave={onSave}
        />

        <HStack justifyContent="center" w="full" gap={1}>
          <Text>Already have an account?</Text>
          <Button variant="link" size="sm" onClick={handleLogout}>
            Re-login
          </Button>
        </HStack>
      </Flex>
    </>
  );
};
