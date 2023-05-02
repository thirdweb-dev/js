import { Wallet } from "@thirdweb-dev/react-core";
import {
  isCredentialsSupported,
  getCredentials,
} from "../ConnectWallet/screens/LocalWallet/credentials";
import { LocalWallet, WalletOptions } from "@thirdweb-dev/wallets";

class LocalWalletWeb extends LocalWallet {
  async autoConnect() {
    // can not auto connect to local wallet if credentialStorage is not supported
    if (!isCredentialsSupported) {
      throw new Error("CredentialStorage is not supported");
    }

    const creds = await getCredentials();

    // if no credentials, then we can not auto connect
    if (!creds) {
      throw new Error("No Crendentials found");
    }

    this.import({
      privateKey: creds.password,
      encryption: false,
    });

    return await this.connect();
  }
}

type LocalWalletConfig = {
  /**
   * If `true`, the encrypted wallet JSON will be stored on localStorage with user's password.
   * the user will not need to enter their password again when they visit the site. Beacuse of this, swallet can not be auto connected.
   *
   * If `false`, wallet will not be stored, and no password will be required to connect.
   * the wallet will be lost when the user leaves or reloads the page.
   *
   * @default true
   */
  persist?: boolean;
};

export type LocalWalletObj = Wallet & {
  config: Required<LocalWalletConfig>;
};

export const localWallet = (config?: LocalWalletConfig) => {
  return {
    id: LocalWallet.id,
    meta: { ...LocalWallet.meta, name: "Guest Wallet" },
    create: (options: WalletOptions) => new LocalWalletWeb(options),
    config: {
      persist: config?.persist || true,
    },
  } satisfies LocalWalletObj;
};
