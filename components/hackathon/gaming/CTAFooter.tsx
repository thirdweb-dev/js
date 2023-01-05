import { Box, Flex, Icon } from "@chakra-ui/react";
import { ImMagicWand } from "@react-icons/all-files/im/ImMagicWand";
import { Logo } from "components/logo";
import { useTrack } from "hooks/analytics/useTrack";
import type { FC } from "react";
import { Heading, LinkButton } from "tw-components";

export const CTAFooter: FC = () => {
  const trackEvent = useTrack();

  return (
    <Flex
      py={20}
      align="center"
      justify="center"
      flexDir="column"
      pos="relative"
      mt={20}
      gap={4}
    >
      <Box
        w="full"
        h={{ base: "200px", md: "400px" }}
        background="linear-gradient(90deg, rgba(137, 253, 20, 0.4) 0%, rgba(47, 53, 201, 0.4) 36.52%, rgba(189, 17, 190, 0.4) 72.51%, rgba(65, 0, 172, 0.4) 100%)"
        filter="blur(150px)"
        transform="matrix(-1, 0, 0, 1, 0, 0)"
        zIndex={0}
        pos="absolute"
      />

      <Logo forceShowWordMark color="#fff" />
      <Heading size="display.lg" textAlign="center" color="white" zIndex={2}>
        $100,000 in prizes
      </Heading>

      <Heading size="title.md" textAlign="center" color="#B7FD18" zIndex={2}>
        BUILD THE FUTURE OF GAMING
      </Heading>

      <LinkButton
        href="https://readyplayer3.devpost.com/"
        onClick={() =>
          trackEvent({
            category: "readyplayer3",
            action: "click",
            label: "register-now",
          })
        }
        h="68px"
        w={{ base: "100%", md: 96 }}
        fontSize="20px"
        leftIcon={<Icon as={ImMagicWand} />}
        color="black"
        flexShrink={0}
        background="rgba(255,255,255,1)"
        _hover={{
          background: "rgba(255,255,255,0.9) !important",
        }}
        isExternal
        noIcon
        mx="auto"
        mt={4}
      >
        Register Now
      </LinkButton>
    </Flex>
  );
};
