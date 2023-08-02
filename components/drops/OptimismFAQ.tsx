import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
} from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { Heading, Text } from "tw-components";

const TRACKING_CATEGORY = "drops-optimism";

const faqs = [
  {
    title: "What is the Superchain faucet?",
    description: (
      <>
        <Text>
          A testnet faucet is a way for blockchain developers to receive free
          funds that can be used to interact with smart contracts on test
          networks, or testnets, like OP Goerli.
        </Text>
        <Text>
          The Superchain Faucet offers developers free testnet ETH to test their
          applications. To access these funds, developers can authenticate using
          their onchain identity or GitHub account. Once authenticated, they can
          claim up to 1 ETH from the faucet every 24 hours.
        </Text>
      </>
    ),
  },
  {
    title: "What is thirdweb?",
    description: (
      <>
        <Text>
          thirdweb is a complete web3 development framework that provides
          everything you need to build, launch, and manage web3 apps.
        </Text>
        <Text>
          The platform provides dev tools (SDKs in common languages,
          plug-and-play UI components, Solidity SDK) and fully managed
          infrastructure services (storage, RPC nodes, on-chain analytics, and
          more) to enable you to go-to-market faster.
        </Text>
      </>
    ),
  },
  {
    title: "What can I do with my Superchain builder NFT?",
    description: (
      <>
        <Text>
          The builder NFT is a free, commemorative digital collectible which is
          non-transferrable, meaning it cant be transferred or sold.
        </Text>
        <Text>
          The NFT has no future utility and is purely to mark your credentials
          as a builder on the Superchain.
        </Text>
      </>
    ),
  },
  {
    title:
      "Can I claim the Superchain builder NFT if I have already deployed a contract to OP Goerli?",
    description: (
      <>
        <Text>
          Yes, but only if you have previously deployed a contract to OP Goerli
          using thirdweb.
        </Text>
        <Text>
          You have to deploy a smart contract using thirdweb to qualify for
          claiming the NFT.
        </Text>
      </>
    ),
  },
];

export const OptimismFaq: React.FC = () => {
  const trackEvent = useTrack();
  const trackToggleFAQ = (title: string) => {
    trackEvent({
      category: TRACKING_CATEGORY,
      action: "toggle",
      label: "faq",
      faqTitle: title,
    });
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      w="full"
      px="10"
      mt={24}
      maxW={{
        base: "100%",
        lg: "container.md",
      }}
    >
      <Heading fontSize="3.5rem" alignSelf="center">
        FAQ
      </Heading>
      <Accordion mt={8} allowMultiple rounded="xl">
        {faqs.map((faq) => (
          <AccordionItem key={faq.title}>
            <Text fontSize="1rem">
              <AccordionButton p={6} onClick={() => trackToggleFAQ(faq.title)}>
                <Box as="span" flex="1" textAlign="left">
                  {faq.title}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </Text>
            <AccordionPanel pb={4}>
              <Flex direction="column" gap={4}>
                {faq.description}
              </Flex>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  );
};
