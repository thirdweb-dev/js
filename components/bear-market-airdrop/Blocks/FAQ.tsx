import { BEAR_MARKET_TRACKING_CATEGORY } from "./Hero";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  ListItem,
  UnorderedList,
} from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import { useTrack } from "hooks/analytics/useTrack";
import Link from "next/link";
import { Heading, Text } from "tw-components";

export const FAQ: React.FC = () => {
  const trackEvent = useTrack();
  const walletAddress = useAddress();
  const trackToggleFAQ = (title: string) => {
    trackEvent({
      category: BEAR_MARKET_TRACKING_CATEGORY,
      action: "toggle",
      label: "faq",
      faqTitle: title,
      walletAddress,
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
        <AccordionItem>
          <Text fontSize="1rem">
            <AccordionButton
              p={6}
              onClick={() => trackToggleFAQ("eligibility")}
            >
              <Box as="span" flex="1" textAlign="left">
                Who is eligible to claim?
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </Text>
          <AccordionPanel pb={4}>
            <Flex gap={4} flexDirection="column">
              <Text>
                Any wallet which has deployed a smart contract between the dates
                of <strong>January 1st 2022</strong> and{" "}
                <strong>April 1st 2023</strong> to the following{" "}
                <strong>mainnet</strong> blockchains is eligible to claim:
              </Text>
              <UnorderedList>
                <ListItem>💎 Ethereum</ListItem>
                <ListItem>💜 Polygon</ListItem>
                <ListItem>🔺 Avalanche</ListItem>
                <ListItem>🟦 Arbitrum</ListItem>
                <ListItem>🔴 Optimism</ListItem>
              </UnorderedList>
              <Text>
                Whilst we appreciate there are many more chains with thousands
                more builders, technical limitations in scraping this data meant
                we could only make the above chains eligible.
              </Text>
            </Flex>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <Text fontSize="1rem">
            <AccordionButton p={6} onClick={() => trackToggleFAQ("rewards")}>
              <Box as="span" flex="1" textAlign="left">
                What can I win?
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </Text>
          <AccordionPanel pb={4}>
            <Flex gap={4} flexDirection="column">
              <Box>
                <Text fontWeight="bold">Common</Text>
                <Text fontWeight="normal">Bear Market Builder NFT</Text>
              </Box>

              <Box>
                <Text
                  fontWeight="bold"
                  bgGradient="linear(to-r, #4830A4, #9786DF)"
                  bgClip="text"
                  w="min-content"
                >
                  Rare
                </Text>
                <Text fontWeight="normal">
                  thirdweb pro early access NFT <br />
                  1 MATIC <br />
                  5 MATIC <br />
                  0.1 ETH <br />
                  1 ETH <br />
                  1K AWS Credits <br />
                  <Link href="https://www.quicknode.com/" target="_blank">
                    Quicknode Credts
                  </Link>
                </Text>
              </Box>

              <Box>
                <Text
                  fontWeight="bold"
                  bgGradient="linear(to-r, #C35AB1, #E9A8D9)"
                  bgClip="text"
                  w="min-content"
                >
                  Legendary
                </Text>
                <Text fontWeight="bold" textDecoration="underline">
                  <Link href="https://lexica.art/" target="_blank">
                    Lexica AI PRO Pass <br />
                  </Link>
                </Text>

                <Text fontWeight="bold" textDecoration="underline">
                  <Link
                    href="https://opensea.io/assets/matic/0xd94b9a574b8b3c926906f11b99a760188d98f0f4/0"
                    target="_blank"
                  >
                    Club IRL NFT <br />
                  </Link>
                </Text>
                <Text fontWeight="bold" textDecoration="underline">
                  <Link href="https://consensus.coindesk.com/" target="_blank">
                    Consensus 2023 Two-Day Pass <br />
                  </Link>
                </Text>
                <Text fontWeight="bold" textDecoration="underline">
                  <Link
                    href="https://opensea.io/collection/crypto-packaged-goods"
                    target="_blank"
                  >
                    CPG Genesis NFT
                  </Link>
                </Text>
              </Box>
            </Flex>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <Text fontSize="1rem">
            <AccordionButton
              p={6}
              onClick={() => trackToggleFAQ("how_it_works")}
            >
              <Box as="span" flex="1" textAlign="left">
                How does the airdrop work?
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </Text>
          <AccordionPanel pb={4}>
            <Flex direction="column" gap={4}>
              <Text>
                We have compiled a list of every wallet address which deployed a
                smart contract between <b>January 1st 2022</b> and{" "}
                <b>April 1st 2023</b>. These addresses have been added to an
                allowlist which will allow you to claim an ERC1155 NFT
              </Text>
              <Text>
                The ERC1155 NFT is an NFT which uses{" "}
                <Link
                  style={{
                    textDecoration: "underline",
                    fontWeight: "bold",
                  }}
                  href="https://portal.thirdweb.com/contracts/explore/pre-built-contracts/pack"
                  rel="noreferrer"
                  target="_blank"
                >
                  thirdweb&apos;s pack contract
                </Link>{" "}
                to bundle other tokens together. When a pack is opened, a
                pre-defined quantity of tokens are randomly selected from the
                ones that were used to create the packs (that haven&apos;t
                already been selected), and awarded to the opener. The pack NFT
                is burned as it&apos;s opened.
              </Text>
              <Text>
                These ‘tokens’ are ERC721 NFTs, and some of which can be
                ‘redeemed’ for the prizes listed above.
              </Text>
            </Flex>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <Text fontSize="1rem">
            <AccordionButton
              p={6}
              onClick={() => trackToggleFAQ("how_to_redeem")}
            >
              <Box as="span" flex="1" textAlign="left">
                How do I redeem a prize?
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </Text>
          <AccordionPanel pb={4}>
            <Flex direction="column" gap={4}>
              <Text>There are two different ways to redeem a prize:</Text>
              <Text fontWeight="bold">NFT Airdrop</Text>
              <Text>
                For some prizes, you will be sent a placeholder NFT once you
                have opened the pack. At a later date, you will be airdropped
                your prize directly into your wallet.
              </Text>
              <Text>The following prizes will follow this method:</Text>
              <UnorderedList>
                <ListItem>
                  <Text fontWeight="bold">CPG Genesis NFT</Text>
                </ListItem>
                <ListItem>
                  <Text fontWeight="bold">thirdweb pro early access NFT</Text>
                </ListItem>
                <ListItem>
                  <Text fontWeight="bold">1 MATIC</Text>
                </ListItem>
                <ListItem>
                  <Text fontWeight="bold">5 MATIC</Text>
                </ListItem>
                <ListItem>
                  <Text fontWeight="bold">0.1 ETH</Text>
                </ListItem>
                <ListItem>
                  <Text fontWeight="bold">1 ETH</Text>
                </ListItem>
              </UnorderedList>
              <Text fontWeight="bold">Email</Text>
              <Text>
                For some prizes, you will receive an email with instructions on
                how to claim or receive your prize. For this reason, please make
                sure you include a correct email address at the start of the
                claim flow.
              </Text>
              <Text>The following prizes will follow this method:</Text>
              <UnorderedList>
                <ListItem>
                  <Text fontWeight="bold">1K AWS Credits</Text>
                </ListItem>
                <ListItem>
                  <Text fontWeight="bold">Quicknode Credits</Text>
                </ListItem>
                <ListItem>
                  <Text fontWeight="bold">Lexica AI Art Pass</Text>
                </ListItem>
                <ListItem>
                  <Text fontWeight="bold">Club IRL NFT</Text>
                </ListItem>
                <ListItem>
                  <Text fontWeight="bold">Consensus 2023 Two-Day Pass</Text>
                </ListItem>
              </UnorderedList>
            </Flex>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};
