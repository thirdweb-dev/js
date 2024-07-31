import { useAccount, useAccountCredits } from "@3rdweb-sdk/react/hooks/useApi";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import {
  Box,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { Button, Card, Text } from "tw-components";
import { CreditsItem } from "./CreditsItem";

export const formatToDollars = (cents: number) => {
  const dollars = cents / 100;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(dollars);
};

export const CreditsButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const trackEvent = useTrack();

  const router = useRouter();
  const { fromOpCredits: fromOpCreditsQuery } = router.query;

  const shouldShowTooltip = useMemo(
    () => fromOpCreditsQuery !== undefined,
    [fromOpCreditsQuery],
  );

  const [shouldClose, setShouldClose] = useState(false);

  const { isLoggedIn } = useLoggedInUser();
  const { data: credits } = useAccountCredits();
  const meQuery = useAccount();
  const totalCreditBalance = credits?.reduce(
    (acc, credit) => acc + credit.remainingValueUsdCents,
    0,
  );

  if (!isLoggedIn || meQuery.isLoading || !meQuery.data) {
    return null;
  }

  const opCredit = credits?.find((crd) => crd.name.startsWith("OP -"));
  const restCredits = credits?.filter((crd) => !crd.name.startsWith("OP -"));

  return (
    <>
      <Box position="relative">
        <Button
          onClick={() => {
            trackEvent({
              category: "credits",
              action: "button",
              label: "view-credits",
            });
            onOpen();
          }}
          variant="outline"
          colorScheme="blue"
          size="sm"
        >
          <Text color="bgBlack" fontWeight="bold">
            Credits: {formatToDollars(totalCreditBalance || 0)}
          </Text>
        </Button>

        <Card
          position="absolute"
          bg="backgroundBody"
          display={shouldShowTooltip && !shouldClose ? "block" : "none"}
          w="300px"
          mt={2}
          zIndex="popover"
        >
          <Text mb={4}>
            You can view how many credits you have here at any time.
          </Text>

          <Button
            onClick={() => setShouldClose(true)}
            variant="outline"
            size="sm"
          >
            Got it
          </Button>
        </Card>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>Credits Balance</ModalHeader>
          <ModalBody>
            <Flex flexDir="column" gap={4}>
              <CreditsItem
                credit={opCredit}
                onCreditsButton={true}
                isOpCreditDefault={true}
                onClickApply={() => {
                  onClose();
                }}
              />
              {restCredits?.map((credit) => (
                <CreditsItem
                  key={credit.couponId}
                  credit={credit}
                  onCreditsButton={true}
                />
              ))}
            </Flex>
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </Modal>
    </>
  );
};
