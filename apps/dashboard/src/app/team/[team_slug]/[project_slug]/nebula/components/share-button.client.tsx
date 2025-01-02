"use client";

import { Button } from "@/components/ui/button";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { CheckIcon, ShareIcon } from "lucide-react";
import { useState } from "react";

export function ShareButton(props: {
  teamId: string;
}) {
  const [isCopied, setIsCopied] = useState(false);

  return (
    <ToolTipLabel label="Copy Invite Link">
      <Button
        variant="outline"
        className="gap-2"
        onClick={() => {
          const url = new URL("https://thirdweb.com/nebula");
          url.searchParams.append("utm_content", props.teamId);
          url.searchParams.append("utm_campaign", "nebula");
          navigator.clipboard.writeText(url.href);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 1000);
        }}
      >
        Share
        {isCopied ? (
          <CheckIcon className="size-4 text-green-500" />
        ) : (
          <ShareIcon className="size-4" />
        )}
      </Button>
    </ToolTipLabel>
  );
}
