import { ToolTipLabel } from "@/components/ui/tooltip";
import { Badge, type BadgeProps } from "tw-components";

export const OpenSeaPropertyBadge: React.FC<BadgeProps> = (props) => {
  return (
    <ToolTipLabel label="This property is supported on OpenSea">
      <Badge
        {...props}
        borderRadius="full"
        variant="outline"
        colorScheme="opensea"
      >
        OpenSea
      </Badge>
    </ToolTipLabel>
  );
};
