import { SignerWallet, WalletOptions } from "@thirdweb-dev/wallets";
import { Signer } from "ethers";
import { WalletConfig } from "@thirdweb-dev/react-core";

/**
 * @internal
 */
export const signerWallet = (signer: Signer): WalletConfig<SignerWallet> => {
  return {
    id: "signerWallet",
    meta: {
      name: "Signer",
      iconURL:
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxwYXRoIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTggNWgyYTIgMiAwIDAgMSAyIDJ2MTJhMiAyIDAgMCAxLTIgMkg0YTIgMiAwIDAgMS0yLTJoLjAyN0EyIDIgMCAwIDEgMiAxOC42NzRWNi43NTRhMiAyIDAgMCAxIDEuNDUtMS45MjNsMTItMy40MjhBMiAyIDAgMCAxIDE4IDMuMzI2VjV6bTAgMnY4LjI0NmEyIDIgMCAwIDEtMS40NSAxLjkyM0wxMC4xNCAxOUgyMFY3aC0yek00IDYuNzU0djExLjkybDEyLTMuNDI4VjMuMzI2TDQgNi43NTR6TTE4IDExVjloMnYyaC0yem0tNS0xYTEgMSAwIDEgMSAwLTIgMSAxIDAgMCAxIDAgMnoiIHN0eWxlPSJmaWxsOiByZ2IoMTY5LCAyMDQsIDIyNyk7Ij48L3BhdGg+PC9zdmc+",
    },
    create: (options: WalletOptions) =>
      new SignerWallet({
        ...options,
        signer,
      }),
  };
};
