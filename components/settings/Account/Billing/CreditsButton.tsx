import { useAccount, useAccountCredits } from "@3rdweb-sdk/react/hooks/useApi";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  Flex,
  ModalFooter,
} from "@chakra-ui/react";
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

  const { isLoggedIn } = useLoggedInUser();
  const { data: credits } = useAccountCredits();
  const meQuery = useAccount();
  const totalCreditBalance = credits?.reduce(
    (acc, crd) => acc + crd.remainingValueUsdCents,
    0,
  );

  if (!isLoggedIn || meQuery.isLoading || !meQuery.data) {
    return null;
  }

  const credit = credits?.find((crd) => crd.name.includes("OP "));

  return (
    <>
      <Button onClick={onOpen} variant="outline" colorScheme="blue" size="sm">
        <Text color="bgBlack" fontWeight="bold">
          Credits: {formatToDollars(totalCreditBalance || 0)}
        </Text>
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>Credits Balance</ModalHeader>
          <ModalBody>
            <Flex flexDir="column" gap={4}>
              <Card p={6} as={Flex} flexDir="column" gap={3}>
                <CreditsItem credit={credit} onCreditsButton={true} />
              </Card>
            </Flex>
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </Modal>
    </>
  );
};
