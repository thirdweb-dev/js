"use client";

import { CopyTextButton } from "./CopyTextButton";

export function CopyAddressButton(props: {
  address: string;
  className?: string;
  iconClassName?: string;
  variant?:
    | "primary"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost";
  copyIconPosition: "left" | "right";
}) {
  const shortenedAddress = `${props.address.slice(0, 6)}...${props.address.slice(0, 4)}`;

  return (
    <CopyTextButton
      textToCopy={props.address}
      textToShow={shortenedAddress}
      tooltip="Copy Address"
      className="font-mono text-sm"
      variant={props.variant}
      copyIconPosition={props.copyIconPosition}
    />
  );
}
