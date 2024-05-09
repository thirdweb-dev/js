import { AccountStatus, useAccount } from "@3rdweb-sdk/react/hooks/useApi";
import { EngineTier } from "@3rdweb-sdk/react/hooks/useEngine";
import {
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spacer,
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
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { useRouter } from "next/router";
import { useState } from "react";
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
          credentials: "include",
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

  const onClick = async (tier: EngineTier) => {
    if (tier === "ENTERPRISE") {
      trackEvent({
        category: "engine",
        action: "click",
        label: "clicked-cloud-hosted",
        tier,
      });
      router.push("/contact-us");
      return;
    }

    await onClickAddToPlan(tier);
  };

  return (
    <Modal
      isOpen={disclosure.isOpen}
      onClose={disclosure.onClose}
      isCentered
      size="6xl"
    >
      <ModalOverlay />
      <ModalContent p={4}>
        <ModalCloseButton />
        <ModalHeader as={Flex} flexDir="column" gap={2}>
          <Heading size="title.sm">Choose an Engine deployment</Heading>
          <Text>
            Host Engine on thirdweb with no setup or maintenance required.
          </Text>
        </ModalHeader>
        <ModalBody>
          <SimpleGrid columns={{ base: 1, lg: 3 }} gap={6}>
            <EngineTierCard
              iconSrc={require("../../../public/assets/engine/cloud-icon1.png")}
              tier="Standard Engine"
              monthlyPrice={99}
              features={[
                "Isolated server & database",
                "APIs for contracts on all EVM chains",
                "Secure backend wallets",
                "Automated gas & nonce management",
                "On-call monitoring from thirdweb",
              ]}
              onClick={() => onClick("STARTER")}
            />

            <EngineTierCard
              iconSrc={require("../../../public/assets/engine/cloud-icon2.png")}
              tier="Premium Engine"
              previousTier="Standard Engine"
              monthlyPrice={299}
              features={[
                "Autoscaling",
                "Server failover",
                "Database failover",
                "30-day database backups",
              ]}
              isPrimaryCta
              onClick={() => onClick("PREMIUM")}
            />

            <EngineTierCard
              iconSrc={require("../../../public/assets/engine/cloud-icon3.png")}
              tier="Enterprise Engine"
              previousTier="Premium Engine"
              features={[
                "Custom features",
                "Custom deployment",
                "Priority support",
              ]}
              onClick={() => onClick("ENTERPRISE")}
            />
          </SimpleGrid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const EngineTierCard = ({
  iconSrc,
  tier,
  monthlyPrice,
  previousTier,
  features,
  isPrimaryCta = false,
  onClick,
}: {
  iconSrc: StaticImport;
  tier: string;
  monthlyPrice?: number;
  previousTier?: string;
  features: string[];
  isPrimaryCta?: boolean;
  onClick: () => void;
}) => {
  return (
    <Card
      as={Stack}
      gap={4}
      boxShadow={
        isPrimaryCta
          ? "0px 2px 4px 3px rgba(79, 106, 202, 0.30), 1px 1px 3px 4px rgba(202, 51, 255, 0.25)"
          : undefined
      }
    >
      {/* Heading */}
      <Stack>
        <Card p="6px" rounded="md" w="fit-content">
          <ChakraNextImage alt="Cloud icon" src={iconSrc} w={6} />
        </Card>
        <Heading as="h3" size="title.md">
          {tier}
        </Heading>
        <Badge colorScheme="green" w="fit-content">
          {monthlyPrice ? `$${monthlyPrice} per month` : "Custom Pricing"}
        </Badge>
      </Stack>

      {/* Features */}
      <Stack spacing={3} py={4}>
        <Text>Includes</Text>
        {previousTier && (
          <Text color="accent.900" fontWeight="bold">
            All of <u>{previousTier}</u>, plus:
          </Text>
        )}
        {features.map((feature) => (
          <Flex key={feature} gap={3} align="center">
            <Icon as={FiCheck} boxSize={4} color="green.500" />
            <Text color="accent.900" fontWeight="medium">
              {feature}
            </Text>
          </Flex>
        ))}
      </Stack>

      <Spacer />

      {/* CTA */}
      <Button
        onClick={onClick}
        variant={isPrimaryCta ? "solid" : "outline"}
        colorScheme={isPrimaryCta ? "blue" : undefined}
      >
        {monthlyPrice ? "Add to my plan" : "Contact us"}
      </Button>
      <Text size="body.sm" textAlign="center">
        {monthlyPrice
          ? `Your payment method will be charged $${monthlyPrice}.`
          : "We'll reach out within 1 business day."}
      </Text>
    </Card>
  );
};
