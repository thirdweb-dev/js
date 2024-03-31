import { AccountPlan, useAccount } from "@3rdweb-sdk/react/hooks/useApi";
import {
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { Button, Heading, TrackedLinkButtonProps, Text } from "tw-components";
import { PLANS } from "utils/pricing";
import { FeatureItem } from "./FeatureItem";
import { useEffect } from "react";
import { useTrack } from "hooks/analytics/useTrack";

interface UpgradeModalProps {
  name: AccountPlan;
  ctaTitle?: string;
  ctaHint?: string;
  ctaProps: TrackedLinkButtonProps;
  canTrialGrowth?: boolean;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  name,
  ctaTitle,
  ctaHint,
  ctaProps,
  canTrialGrowth,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const plan = PLANS[name];
  const account = useAccount();
  const trackEvent = useTrack();

  // We close the modal when the user is on the Growth plan successfully
  useEffect(() => {
    if (account.data?.plan === AccountPlan.Growth) {
      onClose();
    }
  }, [account.data?.plan, onClose]);

  return (
    <>
      <Flex flexDir="column" gap={3} position="relative" mb={3}>
        {ctaTitle && (
          <Button
            onClick={() => {
              trackEvent({
                category: "account",
                action: "click",
                label: "open-upgrade-modal",
              });
              onOpen();
            }}
            colorScheme="primary"
          >
            {ctaTitle}
          </Button>
        )}
        {ctaHint && (
          <Text
            textAlign="center"
            size="body.sm"
            w="full"
            position={{ base: "static", xl: "absolute" }}
            top={ctaTitle ? 14 : -9}
          >
            {ctaHint}
          </Text>
        )}
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading size="title.md" mt={2}>
              Are you sure you want to upgrade to the Growth plan?
            </Heading>
          </ModalHeader>
          <ModalBody p={6} as={Flex} gap={4} flexDir="column">
            <Flex
              flexDir="column"
              gap={3}
              grow={1}
              alignItems="flex-start"
              color="accent.900"
            >
              <Text color="accent.900" fontWeight="medium">
                This entails unlocking exclusive features below:
              </Text>

              {plan.features.map((f) => (
                <FeatureItem key={f} text={f} />
              ))}

              <Text fontWeight="medium" size="body.md" color="faded" mt={2}>
                You will be charged $99 per month for the subscription
                {canTrialGrowth && " after the 30-day trial period"}.
              </Text>
            </Flex>
          </ModalBody>
          <ModalFooter as={Flex} gap={3}>
            <Button onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button {...ctaProps}>Upgrade</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
