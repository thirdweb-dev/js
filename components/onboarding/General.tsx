import { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { AccountForm } from "components/settings/Account/AccountForm";
import { OnboardingTitle } from "./Title";
import { Flex, VStack } from "@chakra-ui/react";
import { Button } from "tw-components";
import { useDisconnect, useLogout } from "@thirdweb-dev/react";
import { useState } from "react";

type OnboardingGeneralProps = {
  account: Account;
  onSave: (email: string) => void;
  onDuplicate: (email: string) => void;
};

export const OnboardingGeneral: React.FC<OnboardingGeneralProps> = ({
  account,
  onSave,
  onDuplicate,
}) => {
  const { logout } = useLogout();
  const [existing, setExisting] = useState(false);
  const disconnect = useDisconnect();

  const handleLogout = async () => {
    await logout();
    disconnect();
  };

  return (
    <>
      <OnboardingTitle
        heading={
          !existing
            ? "Create your thirdweb account"
            : "Log in to your thirdweb account"
        }
        description="Start building web3 apps and games, faster."
      />

      <Flex flexDir="column" gap={4}>
        <AccountForm
          showSubscription={!existing}
          hideName={existing}
          account={account}
          buttonText={!existing ? "Get Started for Free" : "Login"}
          trackingCategory="onboarding"
          padded={false}
          buttonProps={{
            w: "full",
            size: "lg",
            fontSize: "md",
          }}
          onSave={onSave}
          onDuplicateError={onDuplicate}
        />

        <VStack justifyContent="center" w="full" gap={2}>
          {!existing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setExisting(true)}
                w="full"
                size="lg"
                fontSize="md"
              >
                I have a thirdweb account
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                w="full"
                size="lg"
                fontSize="md"
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              onClick={() => setExisting(false)}
              w="full"
              size="lg"
              fontSize="md"
            >
              I don&apos;t have an account
            </Button>
          )}
        </VStack>
      </Flex>
    </>
  );
};
