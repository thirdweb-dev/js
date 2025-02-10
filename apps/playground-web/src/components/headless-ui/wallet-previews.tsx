"use client";

import { WalletIcon, WalletName, WalletProvider } from "thirdweb/react";

export function WalletIconBasicPreview() {
  return (
    <WalletProvider id="io.metamask">
      <WalletIcon
        className="h-20 w-20 rounded-full"
        loadingComponent={<span>Loading...</span>}
      />
    </WalletProvider>
  );
}

export function WalletNameBasicPreview() {
  return (
    <WalletProvider id="io.metamask">
      <WalletName loadingComponent={<span>Loading...</span>} />
    </WalletProvider>
  );
}

export function WalletNameFormatPreview() {
  return (
    <WalletProvider id="io.metamask">
      <WalletName
        formatFn={(str: string) => `${str} Wallet`}
        loadingComponent={<span>Loading...</span>}
      />
    </WalletProvider>
  );
}
