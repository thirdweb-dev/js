"use client";

import { useActiveAccount } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets/in-app";
import { StyledConnectButton } from "../styled-connect-button";
import { StyledConnectEmbed } from "../styled-connect-embed";

export function AnyAuth() {
  const account = useActiveAccount();

  return (
    <div className="flex flex-col">
      {account ? (
        <StyledConnectButton />
      ) : (
        <StyledConnectEmbed wallets={[inAppWallet()]} />
      )}
    </div>
  );
}
