import { BEAR_MARKET_TRACKING_CATEGORY } from ".";
import { gradientMapping } from "../Prizes/Prize";
import {
  AspectRatio,
  Box,
  ButtonGroup,
  Flex,
  useColorMode,
} from "@chakra-ui/react";
import { Polygon } from "@thirdweb-dev/chains";
import { useAddress } from "@thirdweb-dev/react";
import { NFT, NFTMetadata, TransactionResult } from "@thirdweb-dev/sdk";
import { ChakraNextImage } from "components/Image";
import { useTrack } from "hooks/analytics/useTrack";
import { useMemo } from "react";
import { BsEyeFill } from "react-icons/bs";
import { Button, Card, Heading, Text } from "tw-components";
import { NFTMediaWithEmptyState } from "tw-components/nft-media";
import { shortenString } from "utils/usedapp-external";

interface UnboxedProps {
  reward: NFT | undefined;
  tx: TransactionResult | null;
  editionAddress: string;
}

type Metadata = NFTMetadata & {
  attributes: {
    trait_type: string;
    value: string;
  }[];
};

const deliveryMethodMapping: {
  [key: string]: string;
} = {
  "Bear Market Builder NFT": "pack",
  "thirdweb pro early access NFT": "pack",
  "5 Testnet MATIC": "airdrop",
  "1 MATIC": "pack",
  "10 MATIC": "pack",
  "1k AWS Credits": "email",
  "Lexica AI Art Pass": "email",
  "Quicknode Credits: $300": "email",
  "Quicknode Credits: $900": "email",
  "Quicknode Credits: $5000": "email",
  "Quicknode Credits: $25000": "email",
  "Club IRL NFT": "In Pack",
  "Consensus 2023 Two-Day Pass": "email",
  "Checks NFT (VV Edition)": "airdrop",
};

export const Unboxed: React.FC<UnboxedProps> = ({
  reward,
  tx,
  editionAddress,
}) => {
  const nft = reward?.metadata as unknown as Metadata;
  const rarity = nft?.attributes[0]?.value;
  const walletAddress = useAddress();

  const twitterIntentUrl = useMemo(() => {
    const textVariations = [
      `Proud to be a bear market builder. 💪
    
I just claimed a free ${nft?.name} from @thirdweb

Claim yours at:`,
      `I'm a bear market builder and just got a free ${nft?.name} from @thirdweb!
    
Join the party at:`,
      `Thrilled to be a bear market builder and claim my free ${nft?.name} from @thirdweb!
    
Get yours now on:`,
      `Guess what? As a bear market builder, I got a free ${nft?.name} from @thirdweb!
    
You can get one too at:`,
      `I'm a bear market builder, excited to announce I've claimed my free ${nft?.name} from @thirdweb!
    
Now it's your turn at:`,
      `Being a bear market builder pays off! Now, I'm a proud owner of a free ${nft?.name} from @thirdweb!
    
Find out how you can get yours at:`,
      `It's true - bear market builders like me get free ${nft?.name}s from @thirdweb! 🎉
    
Claim yours today at:`,
      `Bear market builder grind pays off. Just got a free ${nft?.name} from @thirdweb!
    
Secure yours at:`,
      `Feeling lucky to be a bear market builder and claim a free ${nft?.name} from @thirdweb! 🎁
    
Don't miss out, go to:`,
      `Bear market builders rejoice! I just scored a free ${nft?.name} from @thirdweb! 🌟
    
You can claim one too at:`,
    ];

    const url = new URL("https://twitter.com/intent/tweet");
    const randomTextIndex = Math.floor(Math.random() * textVariations.length);
    url.searchParams.append("text", textVariations[randomTextIndex]);
    url.searchParams.append("url", "https://thirdweb.com/bear-market-airdrop");
    return url.href;
  }, [nft?.name]);

  const { colorMode } = useColorMode();
  const trackEvent = useTrack();

  if (!nft) {
    return null;
  }
  const method = deliveryMethodMapping[nft?.name ?? ""] || "pack";

  return (
    <Flex direction="column" w="full" pb={16} overflowX="clip">
      <Box
        fontSize={{
          base: "2.5rem",
          lg: "3.5rem",
        }}
        position="relative"
        mb={5}
      >
        <ChakraNextImage
          src={require("public/assets/bear-market-airdrop/unboxedGif.gif")}
          alt="confetti1"
          position="absolute"
          top={{
            base: -40,
            lg: -40,
          }}
          left={{
            base: -40,
            lg: -40,
          }}
        />
        <ChakraNextImage
          src={require("public/assets/bear-market-airdrop/unboxedGif.gif")}
          alt="confetti1"
          position="absolute"
          top={{
            base: -40,
            lg: -40,
          }}
          left={{
            base: 40,
            lg: 40,
          }}
        />
        <Flex
          direction="column"
          justifyContent="center"
          alignItems="center"
          textAlign={{
            base: "center",
            lg: "left",
          }}
        >
          <Heading
            bgGradient={gradientMapping[rarity as string]}
            bgClip="text"
            fontWeight="bold"
            fontSize={{
              base: 32,
              lg: 40,
            }}
          >
            Congratulations
          </Heading>
          <Heading
            fontSize={{
              base: 32,
              lg: 40,
            }}
          >
            you&apos;ve unpacked
          </Heading>
        </Flex>
      </Box>
      <Flex justifyContent="center" alignItems="center" direction="column">
        <Card p={0}>
          <AspectRatio w="100%" ratio={1} overflow="hidden" rounded="xl">
            <NFTMediaWithEmptyState metadata={nft} width="100%" height="100%" />
          </AspectRatio>
          <Flex p={4} pb={3} gap={3} direction="column">
            <Text
              textTransform="uppercase"
              bgGradient={gradientMapping[rarity as string]}
              bgClip="text"
              fontSize="12px"
              fontWeight="bold"
              letterSpacing="1px"
              lineHeight="120%"
              textAlign="center"
            >
              {rarity} Prize
            </Text>
            <Text textAlign="center" fontSize="21px">
              {nft?.name}
            </Text>
            <Text textAlign="center">
              <Text noOfLines={3}>
                {method === "email" && (
                  <>
                    An email has been sent to{" "}
                    <Box as="span" fontWeight="bold">
                      the email you registered with.
                    </Box>
                  </>
                )}
                {method === "pack" && (
                  <>
                    has been sent to <br />{" "}
                    <Box as="span" textDecoration="italic">
                      {`${shortenString(walletAddress || "", true)}`}
                    </Box>
                  </>
                )}
              </Text>
            </Text>
          </Flex>
        </Card>
        <ButtonGroup fontSize="12px" mt={4} mb={6}>
          {tx && (
            <Button
              leftIcon={<BsEyeFill />}
              outline="1px solid #151515"
              size="xs"
              fontWeight="400"
              as="a"
              href={`https://polygonscan.com/tx/${tx?.receipt.transactionHash}`}
              target="_blank"
              bg={colorMode === "light" ? "black" : "transparent"}
              color="white"
              _hover={{
                bg: "black",
              }}
              onClick={() => {
                trackEvent({
                  category: BEAR_MARKET_TRACKING_CATEGORY,
                  action: "unboxed",
                  label: "view_transaction",
                  walletAddress,
                });
              }}
            >
              View transaction
            </Button>
          )}
          <Button
            fontWeight="400"
            outline="1px solid #151515"
            size="xs"
            as="a"
            href={`https://opensea.io/assets/${Polygon.nativeCurrency.name}/${editionAddress}/${nft.id}`}
            target="_blank"
            bg={colorMode === "light" ? "black" : "transparent"}
            _hover={{ bg: "black", opacity: 0.8 }}
            color="white"
            onClick={() => {
              trackEvent({
                category: BEAR_MARKET_TRACKING_CATEGORY,
                action: "unboxed",
                label: "view_on_opensea",
                walletAddress,
              });
            }}
            leftIcon={
              <ChakraNextImage
                src={require("public/assets/bear-market-airdrop/socials/opensea.svg")}
                alt="openseaicon"
              />
            }
          >
            View on OpenSea
          </Button>
        </ButtonGroup>
        <Button
          as="a"
          href="/"
          target="_blank"
          bg={colorMode === "light" ? "black" : "white"}
          color={colorMode === "light" ? "white" : "black"}
          _hover={
            colorMode === "light"
              ? { bg: "black", opacity: 0.8 }
              : { bg: "white", opacity: 0.8 }
          }
          py={3}
          px={6}
          mb={6}
          onClick={() => {
            trackEvent({
              category: BEAR_MARKET_TRACKING_CATEGORY,
              action: "unboxed",
              label: "discover_thirdweb",
              walletAddress,
            });
          }}
        >
          Discover thirdweb
        </Button>
        <Box textAlign="center">
          <Button
            as="a"
            href={twitterIntentUrl}
            target="_blank"
            outline="1px solid #9D2889"
            cursor="pointer"
            py={3}
            px={6}
            bg={colorMode === "light" ? "black" : "transparent"}
            color="white"
            _hover={{
              bg: "black",
              opacity: 0.8,
            }}
            onClick={() => {
              trackEvent({
                category: BEAR_MARKET_TRACKING_CATEGORY,
                action: "unboxed",
                label: "twitter_share",
                walletAddress,
              });
            }}
          >
            <ChakraNextImage
              src={require("public/assets/bear-market-airdrop/socials/twitter.svg")}
              alt="twitter share"
              mr="2"
            />
            Tell the world!
          </Button>
        </Box>
      </Flex>
    </Flex>
  );
};
