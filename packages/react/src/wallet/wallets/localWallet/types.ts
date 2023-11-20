import { WalletConfig } from "@thirdweb-dev/react-core";
import { LocalWallet } from "@thirdweb-dev/wallets";

export type LocalWalletConfigOptions = {
  /**
   * If `true`, the encrypted wallet JSON will be stored on localStorage with user's password.
   * the user will not need to enter their password again when they visit the site. Because of this, the wallet can not be auto connected.
   *
   * If `false`, wallet will not be stored, and no password will be required to connect.
   * the wallet will be lost when the user leaves or reloads the page.
   *
   * @defaultValue true
   */
  persist?: boolean;
};

export type LocalWalletConfig = WalletConfig<LocalWallet>;
