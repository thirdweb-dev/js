import { Flex, Icon, Image, VStack } from "@chakra-ui/react";
import { ImMagicWand } from "@react-icons/all-files/im/ImMagicWand";
import { useTrack } from "hooks/analytics/useTrack";
import type { FC } from "react";
import { Heading, LinkButton } from "tw-components";

export const HackathonFooter: FC = () => {
  const trackEvent = useTrack();

  return (
    <VStack
      bg='url("/assets/hackathon/footer-bg.png")'
      bgSize="cover"
      bgRepeat="no-repeat"
      bgPosition="center"
      w="100%"
      py={20}
      gap={8}
      borderTopRadius="50px"
    >
      <Image
        src="/assets/hackathon/tw-solana.svg"
        alt="Solana Hackathon"
        w={{ base: "300px", md: "600px" }}
        objectFit="contain"
      />
      <Flex flexDir="column" gap={2}>
        <Heading size="title.xl" textAlign="center">
          Build Web3 apps on Solana
        </Heading>
        <Heading
          bgImage="linear-gradient(128deg, #9945FF -9.03%, #14EE92 98.25%)"
          bgClip="text"
          size="display.lg"
          textAlign="center"
        >
          $10,000 in prizes
        </Heading>
        <Heading size="title.xl" textAlign="center">
          Oct 19th - Oct 26th
        </Heading>
      </Flex>

      <LinkButton
        href="https://thirdweb.typeform.com/to/jta0ye4M"
        onClick={() =>
          trackEvent({
            category: "solanathon",
            action: "click",
            label: "register-now",
          })
        }
        h="68px"
        w={{ base: "90%", md: 96 }}
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
        Submit Your Project
      </LinkButton>
    </VStack>
  );
};
