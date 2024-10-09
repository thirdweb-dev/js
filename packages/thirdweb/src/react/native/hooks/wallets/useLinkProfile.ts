import { useMutation } from "@tanstack/react-query";
import { isEcosystemWallet } from "../../../../wallets/ecosystem/is-ecosystem-wallet.js";
import type { AuthArgsType } from "../../../../wallets/in-app/core/authentication/types.js";
import type { Ecosystem } from "../../../../wallets/in-app/core/wallet/types.js";
import { linkProfile } from "../../../../wallets/in-app/web/lib/auth/index.js";
import { useAdminWallet } from "../../../core/hooks/wallets/useAdminWallet.js";

/**
 * Links a web2 or web3 profile to the connected in-app or ecosystem account.
 *
 * **When a profile is linked to the account, that profile can then be used to sign into the same account.**
 *
 * @example
 *
 * ### Linking a social profile
 *
 * ```jsx
 * import { useLinkProfile } from "thirdweb/react";
 *
 * const { mutate: linkProfile } = useLinkProfile();
 *
 * const onClick = () => {
 *   linkProfile({
 *     client,
 *     strategy: "discord", // or "google", "x", "telegram", etc
 *   });
 * };
 * ```
 *
 * ### Linking an email
 *
 * ```jsx
 * import { useLinkProfile } from "thirdweb/react";
 * import { preAuthenticate } from "thirdweb/wallets";
 *
 * const { mutate: linkProfile } = useLinkProfile();
 *
 * // send a verification email first
 * const sendEmail = async () => {
 *   const email = await preAuthenticate({
 *     client,
 *     strategy: "email",
 *     email: "john.doe@example.com",
 *   });
 * };
 *
 * // then link the profile with the verification code
 * const onClick = (code: string) => {
 *   linkProfile({
 *     client,
 *     strategy: "email",
 *     email: "john.doe@example.com",
 *     verificationCode: code,
 *   });
 * };
 * ```
 *
 * The same process can be used for phone and email, simply swap out the `strategy` parameter.
 *
 * ### Linking a wallet
 *
 * ```jsx
 * import { useLinkProfile } from "thirdweb/react";
 *
 * const { mutate: linkProfile } = useLinkProfile();
 *
 * const onClick = () => {
 *   linkProfile({
 *     client,
 *     strategy: "wallet",
 *     wallet: createWallet("io.metamask"), // autocompletion for 400+ wallet ids
 *     chain: sepolia, // any chain works, needed for SIWE signature
 *   });
 * };
 * ```
 *
 * @wallet
 */
export function useLinkProfile() {
  const wallet = useAdminWallet();
  return useMutation({
    mutationKey: ["profiles"],
    mutationFn: async (options: Omit<AuthArgsType, "ecosystem">) => {
      const ecosystem: Ecosystem | undefined =
        wallet && isEcosystemWallet(wallet)
          ? { id: wallet.id, partnerId: wallet.getConfig()?.partnerId }
          : undefined;
      const optionsWithEcosystem = { ...options, ecosystem } as AuthArgsType;
      return linkProfile(optionsWithEcosystem);
    },
  });
}
