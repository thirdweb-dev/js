import { Tooltip } from "@chakra-ui/react";
import { Badge, type BadgeProps } from "tw-components";

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
