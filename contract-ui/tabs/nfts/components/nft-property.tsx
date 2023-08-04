import { Flex } from "@chakra-ui/react";
import { Card, Text } from "tw-components";

interface NftPropertyProps {
  property: any;
}

export const NftProperty: React.FC<NftPropertyProps> = ({ property }) => {
  return (
    <Card as={Flex} flexDir="column" gap={2}>
      {property?.trait_type && (
        <Text
          size="label.sm"
          color="primary.500"
          textAlign="center"
          lineHeight={1.2}
        >
          {property?.trait_type}
        </Text>
      )}
      <Text size="label.md" textAlign="center">
        {property?.value}
      </Text>
    </Card>
  );
};
