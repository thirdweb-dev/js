import { Box, Flex } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { useTrack } from "hooks/analytics/useTrack";
import * as React from "react";
import { Link, Text } from "tw-components";

interface CaseStudyCardProps {
  title: string;
  description: string;
  href: string;
}

export const CaseStudyCard: React.FC<CaseStudyCardProps> = ({
  title,
  description,
  href,
}) => {
  const { trackEvent } = useTrack();
  return (
    <Link
      href={href}
      isExternal
      onClick={() =>
        trackEvent({
          category: "case-study",
          action: "click",
          label: title,
        })
      }
    >
      <Flex
        flexDir="column"
        borderRadius="2xl"
        overflow="hidden"
        position="relative"
        h={96}
        role="group"
      >
        <ChakraNextImage
          alt=""
          w="100%"
          h="100%"
          src={require(`/public/assets/case-studies/${title}.png`)}
          objectFit="cover"
          layout="fill"
        />
        <Box
          position="absolute"
          top={0}
          bottom={0}
          left={0}
          right={0}
          bg="#000"
          opacity={0}
          willChange="opacity"
          transition="opacity 0.1s"
          _groupHover={{
            opacity: 0.3,
          }}
        />
        <Box p={6} position="absolute" top="0" left="0">
          <ChakraNextImage
            alt=""
            w={title === "yestheory" ? 16 : 32}
            placeholder="empty"
            src={require(`/public/assets/case-studies/${title}-logo.png`)}
          />
        </Box>
        <Box
          bgGradient="linear(rgba(0,0,0,.0) 0%,rgba(0,0,0,.5) 25%, rgba(0,0,0,.9) 100%)"
          backdropFilter="blur(10px)"
          p={6}
          borderBottomRadius="2xl"
          position="absolute"
          bottom="-1px"
          left="0"
          right="0"
        >
          <Text size="body.xl" color="white">
            {description}
          </Text>
        </Box>
      </Flex>
    </Link>
  );
};
