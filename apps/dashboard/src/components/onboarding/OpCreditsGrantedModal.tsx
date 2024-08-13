import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
} from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { formatToDollars } from "components/settings/Account/Billing/CreditsButton";
import { useMemo } from "react";
import { FaXTwitter } from "react-icons/fa6";
import { SiOpensea } from "react-icons/si";
import { Card, Heading, Text, TrackedLinkButton } from "tw-components";

interface OpCreditsGrantedModalProps {
  setSawYouGotCredits: (value: boolean) => void;
  creditValue: number;
}

export const OpCreditsGrantedModal: React.FC<OpCreditsGrantedModalProps> = ({
  setSawYouGotCredits,
  creditValue,
}) => {
  const creditValueInDollars = useMemo(
    () => formatToDollars(creditValue),
    [creditValue],
  );

  const twitterIntentUrl = useMemo(() => {
    const url = new URL("https://twitter.com/intent/tweet");
    url.searchParams.append(
      "text",
      `I got accepted into the Superchain App Accelerator by @thirdweb and @Optimism, and received a free NFT!

My app will receive ${creditValueInDollars} to cover gas across any Superchain network.

Apply here!`,
    );
    url.searchParams.append("url", "https://thirdweb.com/grant/superchain");
    return url.href;
  }, [creditValueInDollars]);

  return (
    <Modal
      isOpen={true}
      onClose={() => null}
      isCentered
      closeOnOverlayClick={false}
      closeOnEsc={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">Congratulations!</ModalHeader>
        <ModalBody>
          <Flex flexDir="column" gap={4} position="relative">
            <ChakraNextImage
              src={require("../../../public/assets/dashboard/confetti.gif")}
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
              src={require("../../../public/assets/dashboard/confetti.gif")}
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
              <Text letterSpacing="wider" fontWeight="bold">
                You have received
              </Text>
              <Heading color="bgBlack" size="title.2xl" fontWeight="extrabold">
                {creditValueInDollars}
              </Heading>
              <Text letterSpacing="wider" fontWeight="bold">
                GAS CREDITS
              </Text>
              <Text textAlign="center" color="faded">
                Claimed credits will expire in 6 months.
              </Text>
            </Card>
            <Card as={Flex} flexDir="column" p={0}>
              <Flex p={4} mx="auto">
                <Text
                  letterSpacing="wider"
                  fontWeight="bold"
                  textAlign="center"
                >
                  You have received an NFT on OP Mainnet
                </Text>
              </Flex>
              <Box position="relative">
                <ChakraNextImage
                  src={require("../../../public/assets/dashboard/op-sponsorship-nft.png")}
                  alt=""
                  w="full"
                  priority
                />
              </Box>
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={4} p={4}>
                <TrackedLinkButton
                  isExternal
                  href={twitterIntentUrl}
                  noIcon
                  variant="outline"
                  category="op-sponsorship"
                  label="share-on-x"
                >
                  <Icon as={FaXTwitter} boxSize={6} mr={2} />
                  Post
                </TrackedLinkButton>
                <TrackedLinkButton
                  isExternal
                  href="https://opensea.io/collection/superchain-builder"
                  noIcon
                  variant="outline"
                  category="op-sponsorship"
                  label="view-nft"
                >
                  <Icon as={SiOpensea} boxSize={6} mr={2} />
                  View NFT
                </TrackedLinkButton>
              </SimpleGrid>
            </Card>
            <Accordion allowMultiple rounded="xl">
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
                      credits you have left at the top of the dashboard and in
                      the billing page.
                    </Text>
                    <Text color="faded">
                      Credits are applicable across the following chains: OP
                      Mainnet, Base, Zora, Frax, Mode.
                    </Text>
                  </Flex>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <TrackedLinkButton
            href="/dashboard/connect/account-abstraction?fromOpCredits"
            category="op-sponsorship"
            label="start-using-credits"
            onClick={() => {
              setSawYouGotCredits(true);
            }}
            w="full"
            colorScheme="blue"
          >
            Start using gas credits
          </TrackedLinkButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default OpCreditsGrantedModal;
