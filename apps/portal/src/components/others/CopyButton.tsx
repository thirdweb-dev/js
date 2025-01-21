"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

export function CopyButton(props: { text: string }) {
  const [copied, setCopied] = useState(false);

  function copyToClipboard() {
    navigator.clipboard.writeText(props.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  }

  const Icon = copied ? CheckIcon : CopyIcon;

  return (
    <Button
      variant="outline"
      onClick={copyToClipboard}
      className="h-auto w-auto bg-background p-2"
    >
      <Icon className="size-3 text-muted-foreground" />
    </Button>
  );
}
