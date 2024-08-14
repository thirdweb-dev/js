import type { Wallet } from "../../../interfaces/wallet.js";
import type {
  MultiStepAuthArgsType,
  Profile,
  SingleStepAuthArgsType,
} from "../authentication/types.js";

/**
 * Gets the linked profiles for the provided wallet.
 * This method is only available for in-app wallets.
 *
 * @returns An array of accounts user profiles linked to the current wallet.
 *
 * @example
 * ```ts
 * import { inAppWallet } from "thirdweb/wallets";
 *
 * const wallet = inAppWallet();
 * wallet.connect({ strategy: "google" });
 *
 * const profiles = await getProfiles(wallet);
 *
 * console.log(profiles[0].type);
 * console.log(profiles[0].details.email);
 * ```
 * @wallet
 */
export async function getProfiles(wallet: Wallet<"inApp">) {
  if (wallet.id !== "inApp") {
    throw new Error("Multi-auth currently only supports in-app wallets");
  }

  return (
    wallet as unknown as { getProfiles: () => Promise<Profile[]> }
  ).getProfiles();
}

/**
 * Connects a new profile (authentication method) to the current user.
 * The connected profile can be any valid in-app wallet including email, phone, passkey, etc.
 * The inputs mirror those used when authenticating normally.
 *
 * **When a profile is linked to the account, that profile can then be used to sign into the account.**
 *
 * This method is only available for in-app wallets.
 *
 * @param wallet - The wallet to link an additional profile to.
 * @param auth - The authentications options to add the new profile.
 * @returns A promise that resolves to the currently linked profiles when the connection is successful.
 * @throws If the connection fails, if the profile is already linked to the account, or if the profile is already associated with another account.
 *
 * @example
 * ```ts
 * const wallet = inAppWallet();
 *
 * await wallet.connect({ strategy: "google" });
 * const profiles = await linkProfile(wallet, { strategy: "discord" });
 * ```
 * @wallet
 */
export async function linkProfile(
  wallet: Wallet<"inApp">,
  auth: MultiStepAuthArgsType | SingleStepAuthArgsType,
): Promise<Profile[]> {
  if (wallet.id !== "inApp") {
    throw new Error("Multi-auth currently only supports in-app wallets");
  }

  return (
    wallet as unknown as {
      linkProfile: (authOptions: typeof auth) => Promise<Profile[]>;
    }
  ).linkProfile(auth);
}
