"use client";

import { cn } from "@/lib/utils";
import { CopyTextButton } from "./CopyTextButton";

export function CopyAddressButton(props: {
  address: string;
  className?: string;
  iconClassName?: string;
  tooltip?: string;
  variant?:
    | "primary"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost";
  copyIconPosition: "left" | "right";
}) {
  const shortenedAddress = `${props.address.slice(0, 6)}...${props.address.slice(-4)}`;

  return (
    <CopyTextButton
      className={cn("font-mono text-sm", props.className)}
      copyIconPosition={props.copyIconPosition}
      textToCopy={props.address}
      textToShow={shortenedAddress}
      iconClassName={props.iconClassName}
      tooltip={props.tooltip || "Copy Address"}
      variant={props.variant}
    />
  );
}
