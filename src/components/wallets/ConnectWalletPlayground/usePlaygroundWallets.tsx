import {
  type WalletConfig,
  embeddedWallet,
  smartWallet,
} from "@thirdweb-dev/react";
import { useState } from "react";
import { walletInfoRecord, type WalletId } from "./walletInfoRecord";
import { isProd } from "constants/rpc";

type WalletSelection = Record<WalletId, boolean | "recommended">;

type AuthOption = "google" | "email" | "facebook" | "apple" | "phone";

export function usePlaygroundWallets(defaultWalletSelection: WalletSelection) {
  const [smartWalletOptions, setSmartWalletOptions] = useState({
    factoryAddress: "0xa033aa4a35b9aa70fd3bbae95744110cee12d545",
    enabled: false,
    gasless: true,
  });

  const [socialOptions, setSocialOptions] = useState<AuthOption[]>([
    "email",
    "google",
    "apple",
    "facebook",
    "phone",
  ]);

  const [walletSelection, setWalletSelection] = useState<
    Record<WalletId, boolean | "recommended">
  >(defaultWalletSelection);

  const enabledWallets = Object.entries(walletSelection)
    .filter((x) => x[1])
    .map((x) => x[0] as WalletId);

  const supportedWallets: WalletConfig<any>[] = enabledWallets.map(
    (walletId) => {
      if (walletId === "Email Wallet") {
        walletInfoRecord[walletId].component = embeddedWallet({
          recommended: !!walletSelection[walletId],
          auth: {
            options: socialOptions,
          },
        });
      }

      // set recommended
      walletInfoRecord[walletId].component.recommended =
        walletSelection[walletId] === "recommended";

      // wrap with account abstraction
      const walletConfig = walletInfoRecord[walletId].component;

      return smartWalletOptions.enabled
        ? smartWallet(walletConfig, {
            factoryAddress: smartWalletOptions.factoryAddress,
            gasless: smartWalletOptions.gasless,
            bundlerUrl: isProd
              ? "https://11155111.bundler.thirdweb.com"
              : "https://11155111.bundler.thirdweb-dev.com",
            // eslint-disable-next-line inclusive-language/use-inclusive-words
            paymasterUrl: isProd
              ? "https://11155111.bundler.thirdweb.com"
              : "https://11155111.bundler.thirdweb-dev.com",
          })
        : walletConfig;
    },
  );

  return {
    walletSelection,
    setWalletSelection,
    enabledWallets,
    supportedWallets,
    smartWalletOptions,
    setSmartWalletOptions,
    socialOptions,
    setSocialOptions,
  };
}
