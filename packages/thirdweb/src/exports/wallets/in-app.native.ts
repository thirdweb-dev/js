// --- KEEEP IN SYNC with exports/wallets/in-app.ts ---

export { inAppWallet } from "../../wallets/in-app/native/in-app.js";

export {
  preAuthenticate,
  authenticate,
  getUserEmail,
  getUserPhoneNumber,
} from "../../wallets/in-app/native/auth/index.js";

export { type GetAuthenticatedUserParams } from "../../wallets/in-app/core/authentication/type.js";

// NOT SUPPORTED (yet)

export const hasStoredPasskey = () => {
  throw new Error("Not supported in native");
};
