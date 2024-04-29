import { AccountStatus, useAccount } from "@3rdweb-sdk/react/hooks/useApi";
import {
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
  UseDisclosureReturn,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { OnboardingBilling } from "components/onboarding/Billing";
import { OnboardingModal } from "components/onboarding/Modal";
import { THIRDWEB_API_HOST } from "constants/urls";
import { useTrack } from "hooks/analytics/useTrack";
import { useSingleQueryParam } from "hooks/useQueryParam";
import React from "react";
import { FiCheck } from "react-icons/fi";
import { Badge, Button, Card, Heading, Text } from "tw-components";

interface CreateEngineInstanceButtonProps {
  ctaText: string;
  refetch: () => void;
}

export const CreateEngineInstanceButton = ({
  ctaText,
  refetch,
}: CreateEngineInstanceButtonProps) => {
  const showModalOnLoad = useSingleQueryParam("requestCloudHosted");
  const disclosure = useDisclosure({
    defaultIsOpen: showModalOnLoad !== undefined,
  });
  const paymentDisclosure = useDisclosure();
  const trackEvent = useTrack();
  const toast = useToast();
  const accountQuery = useAccount();

  const requestCloudHostedEngine = async () => {
    trackEvent({
      category: "engine",
      action: "click",
      label: "clicked-cloud-hosted",
    });

    try {
      const res = await fetch(
        `${THIRDWEB_API_HOST}/v1/engine/add-cloud-hosted`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({}),
        },
      );
      if (!res.ok) {
        if (res.status === 409) {
          toast({
            status: "warning",
            description:
              "There is a pending Engine deployment. Please contact support@thirdweb.com if this takes longer than 2 hours.",
          });
          return;
        }
        throw new Error(`Unexpected status ${res.status}`);
      }

      toast({
        status: "success",
        description: "Thank you! Your Engine deployment will begin shortly.",
      });

      // Refresh the engine list to show a pending cloud-hosted Engine instance.
      refetch();
    } catch (e) {
      toast({
        status: "error",
        description: "There was an error with your Engine deployment.",
      });
    }
  };

  return (
    <>
      <Button
        onClick={() => {
          trackEvent({
            category: "engine",
            action: "click",
            label: "add-engine-instance",
          });
          disclosure.onOpen();
        }}
        colorScheme="blue"
        px={6}
      >
        {ctaText}
      </Button>

      {disclosure.isOpen && (
        <CreateCloudHostedEngineModal
          hasValidPayment={
            accountQuery.data?.status === AccountStatus.ValidPayment
          }
          disclosure={disclosure}
          onConfirm={async () => {
            await requestCloudHostedEngine();
            disclosure.onClose();
          }}
          onAddPaymentMethod={() => {
            trackEvent({
              category: "engine",
              action: "click",
              label: "clicked-add-payment-method",
            });

            // Switch the Cloud-hosted Engine modal with the Add Payment modal.
            disclosure.onClose();
            paymentDisclosure.onOpen();
          }}
        />
      )}

      <OnboardingModal
        isOpen={paymentDisclosure.isOpen}
        onClose={paymentDisclosure.onClose}
      >
        <OnboardingBilling
          onSave={async () => {
            await requestCloudHostedEngine();
            paymentDisclosure.onClose();
          }}
          onCancel={paymentDisclosure.onClose}
        />
      </OnboardingModal>
    </>
  );
};

const CreateCloudHostedEngineModal = ({
  hasValidPayment,
  disclosure,
  onConfirm,
  onAddPaymentMethod,
}: {
  hasValidPayment: boolean;
  disclosure: UseDisclosureReturn;
  onConfirm: () => void;
  onAddPaymentMethod: () => void;
}) => {
  const addToPlan = async () => {
    if (hasValidPayment) {
      await onConfirm();
    } else {
      await onAddPaymentMethod();
    }
  };

  return (
    <Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4} px={4} py={8}>
            <Card p="6px" rounded="md" w="fit-content">
              <ChakraNextImage
                alt="Cloud icon"
                src={require("../../../public/assets/engine/cloud-icon.png")}
                w={6}
              />
            </Card>

            <Stack>
              <Heading as="h3" size="title.md">
                Cloud-Hosted Engine
              </Heading>
              <Badge colorScheme="green" w="fit-content">
                $99 per month
              </Badge>
            </Stack>

            <Stack spacing={2} py={4}>
              <Text color="accent.500">Includes:</Text>
              {[
                "Isolated server & database",
                "APIs for contracts on all EVM chains",
                "Secure backend wallets",
                "Automated gas & nonce management",
                "On-call monitoring from thirdweb",
              ].map((feature) => (
                <Flex key={feature} gap={3} align="center">
                  <Icon as={FiCheck} boxSize={4} color="green.500" />
                  <Text color="accent.900" fontWeight="medium">
                    {feature}
                  </Text>
                </Flex>
              ))}
            </Stack>

            <Button onClick={addToPlan} colorScheme="primary" py={6} w="full">
              Add to my plan
            </Button>
            <Text color="accent.500" size="body.sm" textAlign="center">
              Your payment method will be charged $99 per month.
            </Text>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
