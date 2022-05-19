import { Tooltip } from "@chakra-ui/react";
import { Text } from "tw-components";

export const parseDescription = (description?: string | null) => (
  <Tooltip
    label={
      <Text whiteSpace="pre-wrap" color="inherit" p={2}>
        {description}
      </Text>
    }
    openDelay={500}
    borderRadius="md"
  >
    <Text whiteSpace="pre-wrap" noOfLines={6}>
      {description}
    </Text>
  </Tooltip>
);
