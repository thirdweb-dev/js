import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { Text, Card, Heading } from "tw-components";

export const OpCreditsGrantedModal = () => {
  const { isOpen, onClose } = useDisclosure();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>
          Congratulations, you&apos;ve received OP Credits
        </ModalHeader>
        <ModalCloseButton
          onClick={() => {
            onClose();
          }}
        />
        <ModalBody>
          <Flex flexDir="column" gap={4} position="relative">
            <ChakraNextImage
              src={require("public/assets/bear-market-airdrop/unboxedGif.gif")}
              alt="confetti1"
              position="absolute"
              top={{
                base: -60,
                lg: -60,
              }}
              left={{
                base: -60,
                lg: -60,
              }}
            />
            <ChakraNextImage
              src={require("public/assets/bear-market-airdrop/unboxedGif.gif")}
              alt="confetti1"
              position="absolute"
              top={{
                base: -60,
                lg: -60,
              }}
              left={{
                base: 60,
                lg: 60,
              }}
            />
            <Card as={Flex} alignItems="center" gap={2} flexDir="column">
              <Heading color="bgBlack" size="title.2xl" fontWeight="extrabold">
                $250
              </Heading>
              <Text letterSpacing="wider" fontWeight="bold">
                GAS CREDITS
              </Text>
              <Text textAlign="center" color="faded">
                Claimed credits will expire in 90 days.
              </Text>
            </Card>
            <Accordion mt={8} allowMultiple rounded="xl">
              <AccordionItem borderColor="borderColor">
                <Text fontSize="1rem">
                  <AccordionButton p={4} fontWeight="medium">
                    <Box as="span" flex="1" textAlign="left">
                      How to use my credits
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </Text>
                <AccordionPanel pb={6}>
                  <Flex direction="column" gap={4}>
                    <Text color="faded">
                      Credits will automatically be applied to cover gas fees
                      for any on-chain activity across thirdweb services.
                    </Text>
                    <Text color="faded">
                      Credits apply across all API keys. You can see how many
                      credits you have left at the top of the dashboard and{" "}
                      <Link href="/dashboard/settings/billing" color="blue.500">
                        billing page
                      </Link>
                      .
                    </Text>
                  </Flex>
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem borderColor="borderColor">
                <Text fontSize="1rem">
                  <AccordionButton p={4} fontWeight="medium">
                    <Box as="span" flex="1" textAlign="left">
                      Eligible chains
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </Text>
                <AccordionPanel pb={6}>
                  <Flex direction="column" gap={4}>
                    <Text color="faded">Optimism, Base, Zora, Mode.</Text>
                  </Flex>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Flex>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
};
