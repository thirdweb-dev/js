import { Badge } from "@/components/ui/badge";
import { ToolTipLabel } from "@/components/ui/tooltip";

export const OpenSeaPropertyBadge: React.FC = () => {
  return (
    <ToolTipLabel label="This property is supported on OpenSea">
      <Badge>OpenSea</Badge>
    </ToolTipLabel>
  );
};
