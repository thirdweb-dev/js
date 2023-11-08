import { EMAIL_WALLET_ICON, GOOGLE_ICON } from "../../assets";
import { LocaleType } from "../../i18n/types";

export type AuthOption = "email" | SocialLogin;

export type SocialLogin = "google" | "facebook";

export type AuthOptionDictionary = Record<AuthOption, string>;

export const AUTH_OPTIONS_ICONS: AuthOptionDictionary = {
  google: GOOGLE_ICON,
  facebook: GOOGLE_ICON,
  email: EMAIL_WALLET_ICON,
};

export const AUTH_OPTIONS_TEXT: Record<
  AuthOption,
  keyof LocaleType["embedded_wallet"]
> = {
  google: "sign_in_google",
  facebook: "sign_in_facebook",
  email: "sign_in_email",
};
