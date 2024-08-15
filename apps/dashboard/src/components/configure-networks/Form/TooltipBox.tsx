import { ToolTipLabel } from "@/components/ui/tooltip";
import { CircleHelpIcon } from "lucide-react";

export const TooltipBox: React.FC<{
  content: React.ReactNode;
}> = ({ content }) => {
  return (
    <ToolTipLabel label={<div>{content}</div>}>
      <CircleHelpIcon className="size-4 text-muted-foreground" />
    </ToolTipLabel>
  );
};
