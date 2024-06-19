import { Box, Flex } from "@chakra-ui/react";
import { Logo } from "components/logo";
import { useTrack } from "hooks/analytics/useTrack";
import { Heading, LinkButton } from "tw-components";

export const CTAFooter: React.FC = () => {
  const trackEvent = useTrack();

  return (
    <Flex
      py={{ base: 20, md: 40 }}
      align="center"
      justify="center"
      flexDir="column"
      pos="relative"
      mt={20}
      px={4}
      gap={4}
      zIndex={1}
    >
      <Box
        pointerEvents={"none"}
        width="2400px"
        height="1400px"
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        backgroundImage={`radial-gradient(ellipse at center, hsl(300deg 100% 50% / 10%), transparent 60%)`}
      ></Box>

      <Logo forceShowWordMark color="#fff" />

      <Heading
        fontSize={{ base: "32px", md: "72px" }}
        textAlign="center"
        color="white"
        zIndex={2}
        fontWeight={800}
        letterSpacing="-0.04em"
      >
        Build the Future of Gaming.
      </Heading>

      <Heading size="title.xl" textAlign="center" color="#e984f3" zIndex={2}>
        $100,000 in Prizes & Perks.
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
        py={7}
        px={14}
        fontSize="20px"
        color="black"
        flexShrink={0}
        background="rgba(255,255,255,1)"
        _hover={{
          background: "rgba(255,255,255,0.9) !important",
        }}
        isExternal
        noIcon
        mx="auto"
        mt={8}
      >
        Register Now
      </LinkButton>
    </Flex>
  );
};
