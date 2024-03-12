import { BillingCredit, useAccount } from "@3rdweb-sdk/react/hooks/useApi";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";
import { Optimism } from "@thirdweb-dev/chains";
import { ChainIcon } from "components/icons/ChainIcon";
import { ApplyForOpCreditsModal } from "components/onboarding/ApplyForOpCreditsModal";
import { formatDistance } from "date-fns";
import { Text, Button } from "tw-components";
import { formatToDollars } from "./CreditsButton";
import { useLocalStorage } from "hooks/useLocalStorage";
import { useTrack } from "hooks/analytics/useTrack";

interface CreditsItemProps {
  credit?: BillingCredit;
  onCreditsButton?: true;
}

export const CreditsItem: React.FC<CreditsItemProps> = ({
  credit,
  onCreditsButton,
}) => {
  const {
    isOpen: isMoreCreditsOpen,
    onOpen: onMoreCreditsOpen,
    onClose: onMoreCreditsClose,
  } = useDisclosure();
  const trackEvent = useTrack();

  const account = useAccount();

  const [hasAppliedForOpGrant] = useLocalStorage(
    `appliedForOpGrant-${(account?.data && account.data.id) || ""}`,
    false,
  );

  return (
    <>
      <Flex flexDir="column" gap={4}>
        <Flex gap={2}>
          <ChainIcon ipfsSrc={Optimism.icon.url} size={24} />
          <Text color="bgBlack">Sponsorship credit balance</Text>{" "}
          {!hasAppliedForOpGrant && (
            <Button
              size="xs"
              variant="outline"
              onClick={() => {
                onMoreCreditsOpen();
                trackEvent({
                  category: "op-sponsorship",
                  action: "click",
                  label: "apply-now",
                });
              }}
            >
              Apply now
            </Button>
          )}
        </Flex>
        <Flex gap={6}>
          <Flex flexDir="column" gap={1}>
            <Text>Remaining Credits</Text>
            <Text color="bgBlack">
              {formatToDollars(credit?.remainingValueUsdCents || 0)}
            </Text>
          </Flex>
          <Flex flexDir="column" gap={1}>
            <Text>Claimed Credits (All-Time)</Text>
            <Text color="bgBlack">
              {formatToDollars(credit?.originalGrantUsdCents || 0)}
            </Text>
          </Flex>
          <Flex flexDir="column" gap={1}>
            <Text>Expires</Text>
            <Text color="bgBlack" textTransform="capitalize">
              {credit?.expiresAt
                ? formatDistance(new Date(credit.expiresAt), Date.now(), {
                    addSuffix: true,
                  })
                : "N/A"}
            </Text>
          </Flex>
        </Flex>
        {hasAppliedForOpGrant && (
          <Alert
            status="info"
            borderRadius="lg"
            backgroundColor={
              onCreditsButton ? "backgroundBody" : "backgroundCardHighlight"
            }
            borderLeftColor="blue.500"
            borderLeftWidth={4}
            as={Flex}
            gap={1}
          >
            <AlertIcon />
            <AlertDescription>
              Grant application pending approval. You will receive an email once
              your application&apos;s status changes.
            </AlertDescription>
          </Alert>
        )}
      </Flex>
      <ApplyForOpCreditsModal
        isOpen={isMoreCreditsOpen}
        onClose={onMoreCreditsClose}
      />
    </>
  );
};
