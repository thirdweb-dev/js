import Icon from "@chakra-ui/icon";
import { HStack, Stack } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import * as React from "react";
import { BsWallet2 } from "react-icons/bs";
import { Heading, Text } from "tw-components";

interface OctopusCardProps {
  title: string;
  address: string;
  description: string;
}

export const OctopusCard: React.FC<OctopusCardProps> = ({
  title,
  address,
  description,
}) => {
  return (
    <Stack
      spacing={2}
      p={4}
      w={80}
      borderRadius="lg"
      border="1px solid lightgray"
    >
      <ChakraNextImage
        src={require(`/public/assets/landingpage/permissions-${title}.png`)}
        placeholder="empty"
        width={6}
        height={7}
        boxSize={7}
        mb={2}
        alt={title}
      />
      <Heading textTransform="capitalize" size="title.sm">
        {title}
      </Heading>
      <HStack>
        <Icon as={BsWallet2} boxSize={4} color="gray.500" />
        <Text
          size="label.lg"
          color="gray.600"
          fontWeight={500}
          fontFamily="mono"
        >
          {address}
        </Text>
      </HStack>
      <Heading color="rgba(39, 46, 54, 0.9)" as="p" size="subtitle.sm">
        {description}
      </Heading>
    </Stack>
  );
};
