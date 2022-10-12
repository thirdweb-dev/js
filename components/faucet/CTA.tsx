import { AspectRatio, Box, Flex } from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { Card, LinkButton, Text } from "tw-components";

interface ICTA {
  transactionLink: string;
}

export const CTA: React.FC<ICTA> = () => {
  const trackEvent = useTrack();

  return (
    <AspectRatio ratio={{ base: 1 / 1, md: 4 / 1 }}>
      <Card
        position="relative"
        bg="rgba(0,0,0,0.5)"
        backdropFilter="blur(10px)"
        flexDir="column"
        px={10}
        gap={6}
        alignItems="flex-start !important"
        border="1px solid inset rgba(255,255,255,.2)"
      >
        <Box
          bgImage="url(/assets/solana-gradient.png)"
          bgSize="initial"
          bgRepeat="no-repeat"
          bgPosition="center"
          position="absolute"
          top={0}
          bottom={0}
          left={0}
          right={0}
          zIndex={-1}
        />
        <Text
          color="white"
          fontSize={{ base: "24px", md: "32px" }}
          fontWeight="bold"
          maxW="450px"
        >
          Now that you have devnet funds, build your web3 app
        </Text>
        <Flex gap="4" align="center" flexWrap="wrap">
          <LinkButton
            px="6"
            py="4"
            fontSize="18px"
            color="black"
            background="rgba(255,255,255,1)"
            _hover={{
              background: "rgba(255,255,255,0.9) !important",
            }}
            href="/dashboard"
            onClick={() =>
              trackEvent({
                category: "solana-faucet",
                action: "click",
                label: "start",
                title: "Start building",
              })
            }
          >
            Start building
          </LinkButton>

          <LinkButton
            isExternal
            href="https://portal.thirdweb.com"
            bg="rgba(255, 255, 255, 0.1)"
            border="1px solid rgba(255, 255, 255, 0.2)"
            px="6"
            onClick={() =>
              trackEvent({
                category: "solana-faucet",
                action: "click",
                label: "view",
                title: "View docs",
              })
            }
          >
            View docs
          </LinkButton>
        </Flex>
      </Card>
    </AspectRatio>
  );
};
