import { type BillingCredit, useAccount } from "@3rdweb-sdk/react/hooks/useApi";
import { Alert, AlertDescription, AlertIcon, Flex } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { ChainIcon } from "components/icons/ChainIcon";
import { formatDistance } from "date-fns";
import { useTrack } from "hooks/analytics/useTrack";
import { useLocalStorage } from "hooks/useLocalStorage";
import { Card, LinkButton, Text } from "tw-components";
import { formatToDollars } from "./CreditsButton";

interface CreditsItemProps {
  credit?: BillingCredit;
  onCreditsButton?: true;
  isOpCreditDefault?: boolean;
  onClickApply?: () => void;
}

export const CreditsItem: React.FC<CreditsItemProps> = ({
  credit,
  onCreditsButton,
  isOpCreditDefault,
  onClickApply,
}) => {
  const trackEvent = useTrack();
  const account = useAccount();

  const [hasAppliedForOpGrant] = useLocalStorage(
    `appliedForOpGrant-${account?.data?.id || ""}`,
    false,
  );

  const isOpCredit = credit?.name.startsWith("OP -") || isOpCreditDefault;
  const isTwCredit = credit?.name.startsWith("TW -");
  const isStartupCredit = credit?.name.startsWith("SU -");

  let creditTitle = credit?.name ?? "thirdweb credits";
  if (isOpCredit) {
    creditTitle = "Optimism sponsorship credits";
  } else if (isTwCredit) {
    creditTitle = "thirdweb credits";
  } else if (isStartupCredit) {
    creditTitle = "Startup grant credits";
  }

  return (
    <Card p={6} as={Flex} flexDir="column" gap={3}>
      <Flex flexDir="column" gap={4}>
        <Flex gap={2}>
          {isOpCredit ? (
            <ChainIcon
              ipfsSrc={
                // Hard-coded here to remove @thirdweb dev/chains
                "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/optimism/512.png"
              }
              size={24}
            />
          ) : isTwCredit ? (
            <ChakraNextImage
              src={require("../../../../../public/brand/thirdweb-icon.svg")}
              alt="tw-credit"
              boxSize={6}
              objectFit="contain"
            />
          ) : isStartupCredit ? (
            <ChakraNextImage
              src={require("../../../../../public/brand/thirdweb-icon.svg")}
              alt="tw-credit"
              boxSize={6}
              objectFit="contain"
            />
          ) : null}
          <Text color="bgBlack">{creditTitle}</Text>
          {!hasAppliedForOpGrant && isOpCredit && (
            <LinkButton
              href="/dashboard/settings/gas-credits"
              size="xs"
              variant="outline"
              onClick={() => {
                trackEvent({
                  category: "op-sponsorship",
                  action: "click",
                  label: "apply-now",
                });
                if (onClickApply) {
                  onClickApply();
                }
              }}
            >
              Apply Now
            </LinkButton>
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
        {hasAppliedForOpGrant && !credit && isOpCredit && (
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
    </Card>
  );
};
