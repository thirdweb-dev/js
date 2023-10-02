import { smartWallet } from "@thirdweb-dev/react";
import { useState } from "react";
import { walletInfoRecord, WalletId } from "./walletInfoRecord";

type WalletSelection = Record<WalletId, boolean | "recommended">;

export function usePlaygroundWallets(defaultWalletSelection: WalletSelection) {
  const [smartWalletOptions, setSmartWalletOptions] = useState({
    factoryAddress: "0x549BceA1590B6239b967fB46E5487b8177B7cf4D",
    enabled: false,
    gasless: true,
  });

  const [walletSelection, setWalletSelection] = useState<
    Record<WalletId, boolean | "recommended">
  >(defaultWalletSelection);

  const enabledWallets = Object.entries(walletSelection)
    .filter((x) => x[1])
    .map((x) => x[0] as WalletId);

  const supportedWallets = enabledWallets.map((walletId) => {
    // set recommended
    walletInfoRecord[walletId].component.recommended =
      walletSelection[walletId] === "recommended";

    // wrap with smart wallet
    const walletConfig = walletInfoRecord[walletId].component;

    return smartWalletOptions.enabled
      ? smartWallet(walletConfig, {
          factoryAddress: smartWalletOptions.factoryAddress,
          gasless: smartWalletOptions.gasless,
          bundlerUrl: "https://mumbai.bundler-staging.thirdweb.com",
          // eslint-disable-next-line inclusive-language/use-inclusive-words
          paymasterUrl: "https://mumbai.bundler-staging.thirdweb.com",
        })
      : walletConfig;
  });

  return {
    walletSelection,
    setWalletSelection,
    enabledWallets,
    supportedWallets,
    smartWalletOptions,
    setSmartWalletOptions,
  };
}
