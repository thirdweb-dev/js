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

export const localWallet = () => {
  return {
    id: LocalWallet.id,
    meta: { ...LocalWallet.meta, name: "Guest Wallet" },
    create: (options: WalletOptions) => new LocalWalletWeb(options),
  } satisfies Wallet;
};
