import { Box, Container, Flex, SimpleGrid } from "@chakra-ui/react";
import { Heading, Text } from "tw-components";

const stats: StatBoxProps[] = [
  {
    title: "100k+",
    description: "Web3 Developers use thirdweb",
  },
  {
    title: "300k+",
    description: "Total Contracts Deployed",
  },
  {
    title: "5M+",
    description: "Total Transactions",
  },
];

interface StatBoxProps {
  title: string;
  description: string;
  showRightBorder?: boolean;
}

export const Stat: React.FC<StatBoxProps> = ({
  title,
  description,
  showRightBorder,
}) => {
  return (
    <Flex
      justifyContent="center"
      flexDir={"column"}
      zIndex={10}
      position="relative"
      textAlign="center"
      p={{ base: 4, md: 6 }}
      alignItems={"center"}
      border="1px solid #252830"
      borderRadius="12px"
      minH={"244px"}
    >
      <Heading
        as="h3"
        bg="linear-gradient(180deg,#fff,hsla(0,0%,100%,.75))"
        bgClip="text"
        display={"inline-block"}
        letterSpacing="-0.05em"
        fontSize={{ md: "80px", base: "72px" }}
        mb={2}
      >
        {title}
      </Heading>
      <Text
        fontSize={{ md: "24px", base: "20px" }}
        lineHeight={1.5}
        fontWeight={500}
        color="whiteAlpha.700"
      >
        {description}
      </Text>
    </Flex>
  );
};

export const StatsSection: React.FC = () => {
  return (
    <Container
      position="relative"
      maxW={"container.page"}
      mt={20}
      mb={{ base: 12, md: 40 }}
      zIndex={10}
    >
      <Stat title="70,000+" description="developers use thirdweb every month" />
    </Container>
  );
};
