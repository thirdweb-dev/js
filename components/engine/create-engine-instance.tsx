import { AccountStatus, useAccount } from "@3rdweb-sdk/react/hooks/useApi";
import {
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tag,
  UseDisclosureReturn,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { OnboardingBilling } from "components/onboarding/Billing";
import { OnboardingModal } from "components/onboarding/Modal";
import { THIRDWEB_API_HOST } from "constants/urls";
import { useTrack } from "hooks/analytics/useTrack";
import { FiPlus } from "react-icons/fi";
import { IoCheckmarkCircle } from "react-icons/io5";
import { Button, Card, Heading, Text } from "tw-components";

interface CreateEngineInstanceButtonProps {
  refetch: () => void;
}

export const CreateEngineInstanceButton = ({
  refetch,
}: CreateEngineInstanceButtonProps) => {
  const showModalOnLoad =
    window &&
    new URLSearchParams(window.location.search).has("requestCloudHosted");

  const cloudHostedModalDisclosure = useDisclosure({
    defaultIsOpen: showModalOnLoad,
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
      const res = await fetch(`${THIRDWEB_API_HOST}/v1/engine/request`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({}),
      });
      if (!res.ok) {
        if (res.status === 409) {
          toast({
            status: "warning",
            description: `You already requested a cloud-hosted Engine. Please contact sales@thirdweb.com if you have questions.`,
          });
          return;
        }
        throw new Error(`Unexpected status ${res.status}`);
      }

      toast({
        status: "success",
        description: "Thank you! Our team will reach out shortly.",
      });

      // Refresh the engine list to show a pending cloud-hosted Engine instance.
      refetch();
    } catch (e) {
      toast({
        status: "error",
        description:
          "Error submitting your request. Please contact sales@thirdweb.com.",
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
          cloudHostedModalDisclosure.onOpen();
        }}
        colorScheme="blue"
        leftIcon={<Icon as={FiPlus} boxSize={4} />}
      >
        Create instance
      </Button>

      {cloudHostedModalDisclosure.isOpen && (
        <RequestCloudHostedEngineModal
          hasValidPayment={
            accountQuery.data?.status === AccountStatus.ValidPayment
          }
          disclosure={cloudHostedModalDisclosure}
          onConfirm={async () => {
            await requestCloudHostedEngine();
            cloudHostedModalDisclosure.onClose();
          }}
          onAddPaymentMethod={() => {
            trackEvent({
              category: "engine",
              action: "click",
              label: "clicked-add-payment-method",
            });

            // Switch the Cloud-hosted Engine modal with the Add Payment modal.
            cloudHostedModalDisclosure.onClose();
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

const RequestCloudHostedEngineModal = ({
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
  return (
    <Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />

        <ModalHeader>Create Engine Instance</ModalHeader>
        <ModalBody>
          <Card
            w="full"
            as={Flex}
            gap={10}
            flexDir="column"
            p={{ base: 6, md: 10 }}
            h="full"
            borderColor="gray.800"
            mb={4}
          >
            <Flex flexDir="column" gap={6}>
              <Flex flexDir="column" gap={3}>
                <Tag colorScheme="green" w="fit-content">
                  Add-on
                </Tag>
                <Heading as="h3" size="title.md">
                  Cloud-Hosted Engine
                </Heading>
                <Text maxW={320}>Host Engine on thirdweb with no setup.</Text>
              </Flex>

              <Flex alignItems="flex-end" gap={2}>
                <Heading size="title.md" lineHeight={1}>
                  $99
                </Heading>
                <Text size="body.lg">/ month</Text>
              </Flex>
            </Flex>
            <Flex
              flexDir="column"
              gap={3}
              grow={1}
              alignItems="flex-start"
              color="accent.900"
            >
              <Text color="accent.900" fontWeight="medium">
                Includes:
              </Text>

              {[
                "Isolated server & database",
                "On-call monitoring from thirdweb",
                "No long-term commitment",
              ].map((f) => (
                <Flex key={f} gap={2}>
                  <Icon as={IoCheckmarkCircle} boxSize={5} mt={0.5} />
                  <Text>{f}</Text>
                </Flex>
              ))}
            </Flex>

            <VStack gap={3}>
              <Button
                onClick={async () => {
                  if (hasValidPayment) {
                    await onConfirm();
                  } else {
                    await onAddPaymentMethod();
                  }
                }}
                colorScheme="blue"
                py={6}
                w="full"
              >
                Add to my plan
              </Button>
              <Text size="body.sm" textAlign="center">
                We will reach out within 1 business day. You won&apos;t be
                charged until your Engine instance is active.
              </Text>
            </VStack>
          </Card>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
