import { BadgeProps, Tooltip } from "@chakra-ui/react";
import React from "react";
import { Badge } from "tw-components";

export const OpenSeaPropertyBadge: React.FC<BadgeProps> = (props) => {
  return (
    <Tooltip label="This property is supported on OpenSea">
      <Badge
        {...props}
        borderRadius="full"
        variant="outline"
        colorScheme="opensea"
      >
        OpenSea
      </Badge>
    </Tooltip>
  );
};
