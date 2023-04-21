import { AsyncStorage } from "./AsyncStorage";
import { WalletData } from "../evm/wallets/local-wallet";

export class CredentialsStorage implements AsyncStorage {
  async getItem(): Promise<string | null> {
    const credential = await navigator.credentials.get({
      password: true,
      unmediated: true,
    } as CredentialRequestOptions);
    if (credential && "password" in credential) {
      return credential.password as string;
    }
    return null;
  }

  async setItem(_key: string, value: string): Promise<void> {
    const { address } = JSON.parse(value) as WalletData;

    const credentialData = {
      id: address,
      password: value,
    };

    const credential = await navigator.credentials.create({
      password: credentialData,
    } as CredentialCreationOptions);

    if (!credential) {
      throw new Error("Credential not created");
    }
    await navigator.credentials.store(credential);
  }

  async removeItem(): Promise<void> {
    // Question: is there any way to remove a credential?
    const credential = await navigator.credentials.get({
      password: true,
      unmediated: true,
    } as CredentialRequestOptions);
    if (credential) {
      await navigator.credentials.preventSilentAccess();
    }
  }
}
