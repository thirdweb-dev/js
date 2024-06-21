import { Flex, SimpleGrid, type SimpleGridProps } from "@chakra-ui/react";
import { Heading, Text } from "tw-components";

interface Stat {
  title: string;
  description: string;
}

type StatsProps = {
  stats: Stat[];
} & SimpleGridProps;

const Stats = ({ stats, ...rest }: StatsProps) => {
  return (
    <SimpleGrid
      columns={{ base: 1, md: 3 }}
      minH="200px"
      borderRadius="12px"
      border=" 1px solid #424242"
      {...rest}
    >
      {stats.map((stat, idx) => {
        const showBorder = idx !== 0;

        return (
          <Flex
            // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
            key={idx}
            alignItems="center"
            justifyContent="center"
            p={8}
            borderLeft={{
              base: "none",
              md: showBorder ? "1px solid #424242" : "none",
            }}
            borderTop={{
              base: showBorder ? "1px solid #424242" : "none",
              md: "none",
            }}
            flexDir="column"
          >
            <Heading size="title.2xl" textAlign="center">
              {stat.title}
            </Heading>

            <Text
              fontSize={{ base: "16px", md: "20px" }}
              mt="8px"
              textAlign="center"
            >
              {stat.description}
            </Text>
          </Flex>
        );
      })}
    </SimpleGrid>
  );
};

export default Stats;
