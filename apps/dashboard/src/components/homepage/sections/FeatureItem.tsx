import { Flex, Tooltip } from "@chakra-ui/react";
import { CircleCheckIcon, CircleDollarSignIcon } from "lucide-react";
import { Card, Text } from "tw-components";

interface FeatureItemProps {
  text: string | string[];
}

export const FeatureItem: React.FC<FeatureItemProps> = ({ text }) => {
  const titleStr = Array.isArray(text) ? text[0] : text;

  return (
    <Flex gap={2} alignItems="flex-start">
      <CircleCheckIcon className="size-6 fill-white text-black" />
      {Array.isArray(text) ? (
        <Flex alignItems="center" justifyItems="center" gap={2}>
          <Text>{titleStr}</Text>
          <Tooltip
            label={
              <Card
                py={2}
                px={4}
                bgColor="backgroundHighlight"
                borderRadius="lg"
              >
                <Text size="label.sm" lineHeight={1.5}>
                  {text[1]}
                </Text>
              </Card>
            }
            p={0}
            bg="transparent"
            boxShadow="none"
          >
            <Flex display={{ base: "none", md: "block" }} mb={-0.5}>
              <CircleDollarSignIcon className="relative size-4 text-blue-500" />
            </Flex>
          </Tooltip>
          <Text
            className="text-muted-foreground"
            minW="max-content"
            display={{ base: "block", md: "none" }}
          >
            {text[1]}
          </Text>
        </Flex>
      ) : (
        <Text>{titleStr}</Text>
      )}
    </Flex>
  );
};
