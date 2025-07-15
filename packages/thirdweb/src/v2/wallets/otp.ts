import type { Prettify } from "../../utils/type-utils.js";
import type { BaseLoginOptions, UserWallet } from "./types.js";
import { createUserWallet } from "./user.js";

export type SendCodeOptions = Prettify<
  BaseLoginOptions &
    (
      | {
          type: "phone";
          phoneNumber: string;
        }
      | {
          type: "email";
          email: string;
        }
    )
>;

/**
 * Send OTP verification code
 * Sends a one-time password (OTP) to the user's email or phone number for authentication.
 * @param options - Options specifying the delivery method (email or phone) and recipient
 * @returns Promise that resolves when OTP is sent
 * @example
 * ```typescript
 * // Send OTP via email
 * await Wallets.sendCode({
 *   client: thirdwebClient,
 *   type: "email",
 *   email: "user@example.com",
 * });
 *
 * // Send OTP via phone
 * await Wallets.sendCode({
 *   client: thirdwebClient,
 *   type: "phone",
 *   phoneNumber: "+1234567890",
 * });
 * ```
 * @wallet
 */
export async function sendCode(options: SendCodeOptions) {
  const { sendOtp } = await import("../../wallets/in-app/web/lib/auth/otp.js");
  switch (options.type) {
    case "email":
      return sendOtp({
        client: options.client,
        strategy: "email",
        email: options.email,
        ecosystem: options.ecosystem,
      });
    case "phone":
      return sendOtp({
        client: options.client,
        strategy: "phone",
        phoneNumber: options.phoneNumber,
        ecosystem: options.ecosystem,
      });
  }
}

export type VerifyCodeOptions = Prettify<
  BaseLoginOptions &
    (
      | {
          type: "phone";
          phoneNumber: string;
          otp: string;
        }
      | {
          type: "email";
          email: string;
          otp: string;
        }
    )
>;

/**
 * Login with OTP verification
 * Verifies the OTP code and authenticates the user to create a wallet.
 * @param options - Options including the OTP code and recipient details (email or phone)
 * @returns Promise that resolves to UserWallet instance
 * @example
 * ```typescript
 * import { Wallets } from "thirdweb/v2";
 *
 * // Login with email OTP
 * const userWallet = await Wallets.loginWithCode({
 *   client: thirdwebClient,
 *   type: "email",
 *   email: "user@example.com",
 *   otp: "123456",
 * });
 *
 * // Login with phone OTP
 * const userWallet = await Wallets.loginWithCode({
 *   client: thirdwebClient,
 *   type: "phone",
 *   phoneNumber: "+1234567890",
 *   otp: "123456",
 * });
 * ```
 * @wallet
 */
export async function loginWithCode(
  options: VerifyCodeOptions,
): Promise<UserWallet> {
  const { verifyOtp } = await import(
    "../../wallets/in-app/web/lib/auth/otp.js"
  );
  const authResult = await (async () => {
    switch (options.type) {
      case "email":
        return verifyOtp({
          client: options.client,
          strategy: "email",
          email: options.email,
          verificationCode: options.otp,
          ecosystem: options.ecosystem,
        });
      case "phone":
        return verifyOtp({
          client: options.client,
          strategy: "phone",
          phoneNumber: options.phoneNumber,
          verificationCode: options.otp,
          ecosystem: options.ecosystem,
        });
    }
  })();

  return createUserWallet({
    client: options.client,
    ecosystem: options.ecosystem,
    authResult,
  });
}
