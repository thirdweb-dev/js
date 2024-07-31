import { Box, Flex, Icon, Image } from "@chakra-ui/react";
import { HomepageSection } from "components/product-pages/homepage/HomepageSection";
import { BsLightningCharge } from "react-icons/bs";
import { Heading, LinkButton, Text } from "tw-components";

export const AnyEVMSection = () => {
  return (
    <HomepageSection id="any-evm" position="relative" pb={{ base: 36, md: 64 }}>
      <Flex
        flexDir="column"
        pb={24}
        pt={{ base: 12, md: 24 }}
        align="center"
        gap={{ base: 6, md: 8 }}
      >
        <Heading
          bg="linear-gradient(350.21deg, #FFFFFF -13.99%, rgba(255, 255, 255, 0) 136.74%)"
          bgClip="text"
          as="h2"
          size="title.2xl"
          textAlign="center"
          letterSpacing="-0.04em"
        >
          Build on 1,000+ EVM chains
        </Heading>
        <Text
          bg="linear-gradient(29.47deg, #FFFFFF -12.61%, rgba(255, 255, 255, 0) 152.49%)"
          bgClip="text"
          textAlign="center"
          as="h3"
          maxW={480}
          size="label.xl"
          lineHeight={1.2}
        >
          Our tools work with any contract deployed on any EVM-compatible chain.
        </Text>

        <Flex
          flexDir="column"
          justifyContent={"center"}
          alignItems={"center"}
          marginTop={"16px"}
          w={"100%"}
        >
          <LinkButton
            href="/chainlist"
            px={4}
            py={7}
            // h={{ base: "48px", md: "68px" }}
            fontSize="20px"
            leftIcon={<Icon as={BsLightningCharge} color="black" />}
            color="black"
            flexShrink={0}
            background="rgba(255,255,255,1)"
            _hover={{
              background: "rgba(255,255,255,0.9)!important",
            }}
            maxW={"320px"}
            width={"100%"}
          >
            See the Chainlist
          </LinkButton>
        </Flex>
      </Flex>
      <Box
        pointerEvents="none"
        zIndex={-1}
        position="absolute"
        bottom={0}
        h="0"
        w="full"
      >
        <Image
          transform="translate(-50%, -60%)"
          ml="50%"
          alt=""
          w="1500px"
          maxW="250vw"
          src="/assets/landingpage/any-evm.png"
          justifySelf="flex-end"
        />
      </Box>
    </HomepageSection>
  );
};
