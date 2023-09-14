import { Flex, Box } from "@chakra-ui/react";
import { NFT, ThirdwebNftMedia } from "@thirdweb-dev/react";
import { ChakraNextImage } from "components/Image";
import React, { useMemo } from "react";
import { TrackedLinkButton, Heading, Card, Text } from "tw-components";

const TRACKING_CATEGORY = "drops-optimism";

interface NFTShowcaseProps {
  nft: NFT | undefined;
}

export const NFTShowcase: React.FC<NFTShowcaseProps> = ({ nft }) => {
  const twitterIntentUrl = useMemo(() => {
    const textVariations = [
      `I'm excited to be building on the Superchain. 🔴
      
Check out this free NFT I claimed for deploying a contract on OP Goerli!`,
      `Proud to be a builder on the Superchain. 💪

Check out this free NFT I claimed for deploying a contract on OP Goerli!`,
      `Honored to be a developer on Superchain. 🔥

Check out this free NFT I claimed for deploying a contract on OP Goerli!`,
      `Building the future with @thirdweb and @Optimism. 🚀

Check out this free NFT I claimed for deploying a contract on OP Goerli!`,
    ];

    const url = new URL("https://twitter.com/intent/tweet");
    const randomTextIndex = Math.floor(Math.random() * textVariations.length);
    url.searchParams.append("text", textVariations[randomTextIndex]);
    url.searchParams.append("url", "https://thirdweb.com/drops/optimism");
    return url.href;
  }, []);

  return (
    <Flex direction="column" w="full" pb={16} overflowX="clip" mt={6} pr={10}>
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
            base: 0,
            lg: 0,
          }}
          left={{
            base: 0,
            lg: 0,
          }}
          width="30%"
        />
        <ChakraNextImage
          src={require("public/assets/bear-market-airdrop/unboxedGif.gif")}
          alt="confetti1"
          position="absolute"
          top={{
            base: 0,
          }}
          right={{
            base: 0,
            lg: 0,
          }}
          width="30%"
        />
        <Flex
          direction="column"
          justifyContent="center"
          alignItems="center"
          gap={6}
        >
          <Heading size="title.xl" textAlign="center">
            Tasks successfully{" "}
            <Box
              as="span"
              bgGradient="linear(to-r, #743F9E, #BFA3DA)"
              bgClip="text"
            >
              completed
            </Box>
          </Heading>
          {nft?.metadata && (
            <ThirdwebNftMedia
              metadata={nft.metadata}
              width="160px"
              height="160px"
            />
          )}
          <Text>The NFT has been transferred to your wallet.</Text>
        </Flex>
      </Box>
      <Flex
        justifyContent="center"
        alignItems="center"
        direction="column"
        gap={4}
      >
        <Card p={0}>
          {/* <AspectRatio w="100%" ratio={1} overflow="hidden" rounded="xl">
             <NFTMediaWithEmptyState metadata={nft} width="100%" height="100%" />
          </AspectRatio>*/}
        </Card>
        <TrackedLinkButton
          href="/dashboard/contracts/deploy"
          isExternal
          py={3}
          px={6}
          bg="bgBlack"
          color="bgWhite"
          _hover={{
            opacity: 0.8,
          }}
          category={TRACKING_CATEGORY}
          label="see-contracts"
        >
          See your contracts
        </TrackedLinkButton>
        <Box textAlign="center">
          <TrackedLinkButton
            href={twitterIntentUrl}
            isExternal
            py={3}
            px={6}
            bg="bgWhite"
            color="bgBlack"
            _hover={{
              opacity: 0.8,
            }}
            category={TRACKING_CATEGORY}
            label="twitter-share"
          >
            <>
              <ChakraNextImage
                src={require("public/assets/bear-market-airdrop/socials/twitter.svg")}
                alt="twitter share"
                mr="2"
                bgClip="bgWhite"
              />
              Tell the world!
            </>
          </TrackedLinkButton>
        </Box>
      </Flex>
    </Flex>
  );
};
