import { WalletConfig, safeWallet, smartWallet } from "@thirdweb-dev/react";
import { useState } from "react";
import { walletInfoRecord, WalletId } from "./walletInfoRecord";
import { isProd } from "constants/rpc";

type WalletSelection = Record<WalletId, boolean | "recommended">;

export function usePlaygroundWallets(defaultWalletSelection: WalletSelection) {
  const [smartWalletOptions, setSmartWalletOptions] = useState({
    factoryAddress: "0x2e9f5A20c8A7270085F4ed716d58e72dFF8D098f",
    enabled: false,
    gasless: true,
  });

  const [walletSelection, setWalletSelection] = useState<
    Record<WalletId, boolean | "recommended">
  >(defaultWalletSelection);

  const enabledWallets = Object.entries(walletSelection)
    .filter((x) => x[1])
    .map((x) => x[0] as WalletId);
  const supportedWallets: WalletConfig<any>[] = enabledWallets.map(
    (walletId) => {
      // set recommended
      walletInfoRecord[walletId].component.recommended =
        walletSelection[walletId] === "recommended";

      // wrap with smart wallet
      const walletConfig = walletInfoRecord[walletId].component;

      return smartWalletOptions.enabled
        ? smartWallet(walletConfig, {
            factoryAddress: smartWalletOptions.factoryAddress,
            gasless: smartWalletOptions.gasless,
            bundlerUrl: isProd
              ? "https://goerli.bundler.thirdweb.com"
              : "https://goerli.bundler.thirdweb-dev.com",
            // eslint-disable-next-line inclusive-language/use-inclusive-words
            paymasterUrl: isProd
              ? "https://goerli.bundler.thirdweb.com"
              : "https://goerli.bundler.thirdweb-dev.com",
          })
        : walletConfig;
    },
  );

  if (walletSelection["Safe"]) {
    const safeId = walletInfoRecord["Safe"].component.id;
    const safeWalletIndex = supportedWallets.findIndex((w) => w.id === safeId);
    const personalWallets = supportedWallets.filter((w) => w.id !== safeId);

    supportedWallets[safeWalletIndex] = safeWallet({
      personalWallets: personalWallets.length ? personalWallets : undefined,
    });
  }

  return {
    walletSelection,
    setWalletSelection,
    enabledWallets,
    supportedWallets,
    smartWalletOptions,
    setSmartWalletOptions,
  };
}
