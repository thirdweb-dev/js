import { AsyncStorage } from "./AsyncStorage";

// TODO: remove this file - this is not being used

/**
 * @internal
 */
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

  async setItem(key: string, value: string): Promise<void> {
    const credential = await navigator.credentials.create({
      password: {
        id: key,
        name: key,
        password: value,
      },
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
