import { Flex, Stack } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { StaticImageData } from "next/image";
import AdvancedNftsPng from "public/assets/tw-icons/advanced-nfts.png";
import UpcomingAnalyticsPng from "public/assets/tw-icons/analytics.png";
import DataPng from "public/assets/tw-icons/data.png";
import UpcomingPermissionsPng from "public/assets/tw-icons/permissions.png";
import React from "react";
import { Heading, Text } from "tw-components";

export type UpcomingFeatureCardType =
  | "analytics"
  | "permissions"
  | "advanced_nfts"
  | "data";

interface IUpcomingFeatureCardDetails {
  title: string;
  description: string;
  icon: StaticImageData;
}

interface IUpcomingFeature {
  type: UpcomingFeatureCardType;
}

const upcomingFeatureCardMap: Record<
  UpcomingFeatureCardType,
  IUpcomingFeatureCardDetails
> = {
  analytics: {
    title: "Analytics",
    description:
      "Powerful, easy to use insights to help you understand your project's performance",
    icon: UpcomingAnalyticsPng,
  },
  permissions: {
    title: "Permissions",
    description: "Fine grained access control that scales with your team",
    icon: UpcomingPermissionsPng,
  },
  advanced_nfts: {
    title: "Advanced NFTs",
    description:
      "Tokens with secret encrypted content/links and programmable metadata changes",
    icon: AdvancedNftsPng,
  },
  data: {
    title: "Data",
    description:
      "Emit on chain events, store key/value or merkle roots for your existing contracts",
    icon: DataPng,
  },
};

export const UpcomingFeature: React.FC<IUpcomingFeature> = ({ type }) => {
  const { title, description, icon } = upcomingFeatureCardMap[type];
  return (
    <Flex
      flexGrow={1}
      py={7}
      px={{ base: 6, md: 10 }}
      direction="column"
      align="center"
      borderRadius="md"
      background="black"
      margin="10px"
      bg="linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.0025) 100%)"
      border="1px solid rgba(255, 255, 255, 0.05)"
    >
      <Stack direction="column" align="center" justify="center" spacing={4}>
        <ChakraNextImage
          alt={`${title} icon`}
          layout="responsive"
          boxSize={{ base: 8, lg: 16 }}
          src={icon}
          flexShrink={0}
        />

        <Heading color="#F2FBFF" size="title.sm" mb="12px">
          {title}
        </Heading>
      </Stack>
      <Text
        mt={6}
        color="rgba(242, 251, 255, 0.8)"
        size="body.lg"
        textAlign="center"
      >
        {description}
      </Text>
    </Flex>
  );
};
