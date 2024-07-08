import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { Flex, FocusLock, VStack } from "@chakra-ui/react";
import { AccountForm } from "components/settings/Account/AccountForm";
import { useState } from "react";
import { useActiveWallet, useDisconnect } from "thirdweb/react";
import { Button } from "tw-components";
import { OnboardingTitle } from "./Title";

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
  const [existing, setExisting] = useState(false);
  const activeWallet = useActiveWallet();
  const { disconnect } = useDisconnect();

  async function handleDisconnect() {
    if (activeWallet) {
      disconnect(activeWallet);
    }
  }

  return (
    <FocusLock>
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
                variant="link"
                onClick={handleDisconnect}
                w="full"
                size="sm"
                pt={4}
                pb={2}
              >
                Log out
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
    </FocusLock>
  );
};
