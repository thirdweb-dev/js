import { AccountStatus, useAccount } from "@3rdweb-sdk/react/hooks/useApi";
import type { EngineTier } from "@3rdweb-sdk/react/hooks/useEngine";
import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  type UseDisclosureReturn,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { OnboardingBilling } from "components/onboarding/Billing";
import { OnboardingModal } from "components/onboarding/Modal";
import { THIRDWEB_API_HOST } from "constants/urls";
import { useTrack } from "hooks/analytics/useTrack";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button, Heading, Text } from "tw-components";
import { EngineTierCard, MONTHLY_PRICE_USD } from "./tier-card";

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
  const [engineTier, setEngineTier] = useState<EngineTier>("STARTER");

  const addCloudHostedEngine = async (tier?: EngineTier) => {
    trackEvent({
      category: "engine",
      action: "click",
      label: "clicked-cloud-hosted",
      tier: tier ?? engineTier,
    });

    try {
      const res = await fetch(
        `${THIRDWEB_API_HOST}/v1/engine/add-cloud-hosted`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            tier: tier ?? engineTier,
          }),
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

        const json = await res.json();
        const error =
          json.error?.message ??
          "Unexpected error. Please try again or visit https://thirdweb.com/support.";
        throw error;
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
        description: `${e}`,
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
          disclosure={disclosure}
          onClickAddToPlan={async (tier: EngineTier) => {
            setEngineTier(tier);
            disclosure.onClose();

            if (accountQuery.data?.status === AccountStatus.ValidPayment) {
              await addCloudHostedEngine(tier);
            } else {
              trackEvent({
                category: "engine",
                action: "click",
                label: "clicked-add-payment-method",
              });
              // Switch the Cloud-hosted Engine modal with the Add Payment modal.
              paymentDisclosure.onOpen();
            }
          }}
        />
      )}

      <OnboardingModal
        isOpen={paymentDisclosure.isOpen}
        onClose={paymentDisclosure.onClose}
      >
        <OnboardingBilling
          onSave={async () => {
            await addCloudHostedEngine();
            paymentDisclosure.onClose();
          }}
          onCancel={paymentDisclosure.onClose}
        />
      </OnboardingModal>
    </>
  );
};

const CreateCloudHostedEngineModal = ({
  disclosure,
  onClickAddToPlan,
}: {
  disclosure: UseDisclosureReturn;
  onClickAddToPlan: (tier: EngineTier) => void;
}) => {
  const trackEvent = useTrack();
  const router = useRouter();
  const [modalState, setModalState] = useState<
    "selectTier" | "confirmStandard" | "confirmPremium"
  >("selectTier");

  if (modalState === "confirmStandard" || modalState === "confirmPremium") {
    const tier: EngineTier =
      modalState === "confirmStandard" ? "STARTER" : "PREMIUM";

    return (
      <Modal
        isOpen={disclosure.isOpen}
        onClose={disclosure.onClose}
        isCentered
        size="lg"
      >
        <ModalOverlay />
        <ModalContent p={4} pt={8}>
          <ModalCloseButton />
          <ModalBody as={Flex} flexDir="column" gap={6}>
            <ChakraNextImage
              alt="Engine hero image"
              src={require("../../../public/assets/engine/empty-state-header.png")}
              w="fit-content"
            />
            <Heading size="title.sm">
              Are you sure you want to deploy a{" "}
              {tier === "STARTER" ? "Standard" : "Premium"} Engine?
            </Heading>
            <Text>
              You will be charged ${MONTHLY_PRICE_USD[tier]} per month for the
              subscription.
            </Text>
          </ModalBody>
          <ModalFooter as={Flex} alignItems="flex-end" gap={3}>
            <Button onClick={() => setModalState("selectTier")} variant="ghost">
              Back
            </Button>
            <Button onClick={() => onClickAddToPlan(tier)} colorScheme="blue">
              Deploy now
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={disclosure.isOpen}
      onClose={disclosure.onClose}
      isCentered
      size="6xl"
    >
      <ModalOverlay />
      <ModalContent p={4} pb={8}>
        <ModalCloseButton />
        <ModalHeader>
          <Heading size="title.sm">Choose an Engine deployment</Heading>
        </ModalHeader>
        <ModalBody as={Flex} flexDir="column" gap={4}>
          <Text>
            Host Engine on thirdweb with no setup or maintenance required.
          </Text>
          <SimpleGrid columns={{ base: 1, lg: 3 }} gap={6}>
            <EngineTierCard
              tier="STARTER"
              onClick={() => setModalState("confirmStandard")}
            />

            <EngineTierCard
              tier="PREMIUM"
              isPrimaryCta
              onClick={() => setModalState("confirmPremium")}
            />

            <EngineTierCard
              tier="ENTERPRISE"
              previousTier="Premium Engine"
              onClick={() => {
                trackEvent({
                  category: "engine",
                  action: "click",
                  label: "clicked-cloud-hosted",
                  tier: "ENTERPRISE",
                });
                router.push("/contact-us");
              }}
            />
          </SimpleGrid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
