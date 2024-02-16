import { Flex, Icon, VStack } from "@chakra-ui/react";
import { ImMagicWand } from "@react-icons/all-files/im/ImMagicWand";
import { ChakraNextImage } from "components/Image";
import { useTrack } from "hooks/analytics/useTrack";
import { FiSearch } from "react-icons/fi";
import { Heading, LinkButton } from "tw-components";

interface HackathonFooterProps {
  TRACKING_CATEGORY: string;
}

export const HackathonFooter = ({
  TRACKING_CATEGORY,
}: HackathonFooterProps) => {
  const trackEvent = useTrack();

  return (
    <VStack
      bg='url("/assets/hackathon/footer-bg.png")'
      bgSize="cover"
      bgRepeat="no-repeat"
      bgPosition="center"
      w="100%"
      py={20}
      gap={10}
      borderTopRadius="50px"
      px={6}
    >
      <ChakraNextImage
        src={require("public/assets/landingpage/thirdwebw.svg")}
        alt="hackathon-partner"
        w={{ base: "300px", md: "400px" }}
        objectFit="contain"
      />
      <ChakraNextImage
        src={require("public/assets/landingpage/consumer-crypto-logo.svg")}
        alt="Hackathon"
        maxW={{ base: "full", lg: "5xl" }}
      />

      <Heading
        size="title.sm"
        color="white"
        opacity={0.7}
        letterSpacing={5}
        textAlign="center"
      >
        FEBRUARY 16 - 18
      </Heading>

      <Flex
        alignItems="center"
        justifyContent="center"
        gap="20px"
        flexWrap="wrap"
      >
        <LinkButton
          href="https://docs.google.com/forms/d/1CT8LPG1DrcpTKAW38ScVzTcyBNwS6ANOk6xpfjpXLAs/edit"
          onClick={() =>
            trackEvent({
              category: TRACKING_CATEGORY,
              action: "click",
              label: "register-now",
            })
          }
          h="68px"
          w={{ base: "90%", md: 80 }}
          fontSize="20px"
          leftIcon={<Icon as={ImMagicWand} />}
          color="black"
          flexShrink={0}
          background="rgba(255,255,255,1)"
          _hover={{
            background: "rgba(255,255,255,0.9)!important",
          }}
          isExternal
          noIcon
        >
          Register now
        </LinkButton>

        <LinkButton
          href="https://forms.gle/9X2gz7H28zvcf47f6"
          onClick={() =>
            trackEvent({
              category: TRACKING_CATEGORY,
              action: "click",
              label: "register-now",
            })
          }
          h="68px"
          w={{ base: "90%", md: 80 }}
          fontSize="20px"
          leftIcon={<Icon as={FiSearch} />}
          color="black"
          flexShrink={0}
          background="rgba(255,255,255,1)"
          _hover={{
            background: "rgba(255,255,255,0.9)!important",
          }}
          isExternal
          noIcon
        >
          Submission
        </LinkButton>
      </Flex>
    </VStack>
  );
};
