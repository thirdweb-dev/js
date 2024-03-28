import {
  APPLE_ICON,
  EMAIL_WALLET_ICON,
  FACEBOOK_ICON,
  GOOGLE_ICON,
} from "../../assets";
import { LocaleType } from "../../i18n/types";

export type AuthOption = "email" | SocialLogin;

export type SocialLogin = "google" | "apple" | "facebook";

export type AuthOptionDictionary = Record<AuthOption, string>;

export const AUTH_OPTIONS_ICONS: AuthOptionDictionary = {
  google: GOOGLE_ICON,
  email: EMAIL_WALLET_ICON,
  apple: APPLE_ICON,
  facebook: FACEBOOK_ICON,
};

export const AUTH_OPTIONS_TEXT: Record<
  AuthOption,
  keyof LocaleType["embedded_wallet"]
> = {
  google: "sign_in_google",
  email: "sign_in_email",
  apple: "sign_in_apple",
  facebook: "sign_in_facebook",
};
