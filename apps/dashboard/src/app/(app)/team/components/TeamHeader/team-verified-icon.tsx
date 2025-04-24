import { ToolTipLabel } from "@/components/ui/tooltip";
import { VerifiedIcon } from "lucide-react";

export function TeamVerifiedIcon(props: {
  domain: string | null;
}) {
  if (!props.domain) {
    return null;
  }

  return (
    <ToolTipLabel
      label={
        <>
          <b className="font-mono">{props.domain}</b> is verified
        </>
      }
    >
      <VerifiedIcon className="size-4 text-blue-500" />
    </ToolTipLabel>
  );
}
