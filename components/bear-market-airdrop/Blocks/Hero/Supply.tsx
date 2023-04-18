import { Flex } from "@chakra-ui/react";
import { Text } from "tw-components";

interface SupplyProps {
  supply: string;
}

const addCommas = (num: string) => {
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const Supply: React.FC<SupplyProps> = ({ supply }) => {
  return (
    <Flex
      gap={2}
      mx={{
        base: "auto",
        lg: 0,
      }}
    >
      <Text
        bgGradient="linear(to-tr, #743F9E, #BFA3DA)"
        bgClip="text"
        display="inline-block"
        w="min"
        fontWeight="bold"
        size="body.2xl"
      >
        {addCommas(supply)}
      </Text>
      <Text size="body.2xl">packs remaining</Text>
    </Flex>
  );
};
