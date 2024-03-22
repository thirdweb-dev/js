import React, { ReactNode } from "react";
import { Flex, FlexProps } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { StaticImageData } from "next/image";
import { Text } from "tw-components";

type LandingTwitterCardProps = {
  src: StaticImageData;
  name: string;
  username: string;
  twitterContent: ReactNode;
  isVerified?: boolean;
  showReactions?: boolean;
} & FlexProps;

const icons = {
  share: require("public/assets/landingpage/share.svg"),
  retweet: require("public/assets/landingpage/retweet.svg"),
  like: require("public/assets/landingpage/like.svg"),
  favorite: require("public/assets/landingpage/favorite.svg"),
};

const LandingTwitterCard = ({
  src,
  name,
  username,
  twitterContent,
  isVerified = false,
  showReactions = true,
  ...rest
}: LandingTwitterCardProps) => {
  return (
    <Flex
      flexDirection="column"
      borderRadius="8px"
      border="1px solid #26282F"
      background="#131418"
      padding={{ base: "20px", md: "41px 32px 25px 30px" }}
      overflowX="hidden"
      {...rest}
    >
      <Flex alignItems="center">
        <ChakraNextImage
          borderRadius="50%"
          h="64px"
          w="64px"
          src={src}
          alt="twitter-pfp"
        />

        <Flex flexDir="column" ml="16px">
          <Flex alignItems="center">
            <Text mt="2px" fontSize="18px" fontWeight={700} color="#fff">
              {name}
            </Text>

            {isVerified && (
              <ChakraNextImage
                h={19}
                w={19}
                src={require("public/assets/landingpage/verified.svg")}
                alt="checkmark"
                ml="12px"
              />
            )}
          </Flex>

          <Text mt="2px" fontSize="14px" color="rgba(255, 255, 255, 0.70)">
            {username}
          </Text>
        </Flex>
      </Flex>

      <Flex mt="20px">{twitterContent}</Flex>

      {showReactions && (
        <Flex flexDir="column">
          <Flex
            mt="24px"
            background="rgba(255, 255, 255, 0.70)"
            w="full"
            h="1px"
          />

          <Flex justifyContent="space-between" mt="24px" wrap="wrap" gap="40px">
            {Object.entries(icons).map(([key, img]) => (
              <ChakraNextImage key={key} h={19} w={19} src={img} alt={key} />
            ))}
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};

export default LandingTwitterCard;
