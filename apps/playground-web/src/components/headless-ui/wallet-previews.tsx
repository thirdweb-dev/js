"use client";

import { WalletIcon, WalletName, WalletProvider } from "thirdweb/react";

export function WalletIconBasicPreview() {
  return (
    // biome-ignore lint/nursery/useUniqueElementIds:ID is not the html attribute in this case
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
    // biome-ignore lint/nursery/useUniqueElementIds:ID is not the html attribute in this case
    <WalletProvider id="io.metamask">
      <WalletName loadingComponent={<span>Loading...</span>} />
    </WalletProvider>
  );
}

export function WalletNameFormatPreview() {
  return (
    // biome-ignore lint/nursery/useUniqueElementIds:ID is not the html attribute in this case
    <WalletProvider id="io.metamask">
      <WalletName
        formatFn={(str: string) => `${str} Wallet`}
        loadingComponent={<span>Loading...</span>}
      />
    </WalletProvider>
  );
}
