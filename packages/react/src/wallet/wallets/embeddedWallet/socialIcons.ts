import { EmbeddedWalletOauthStrategy } from "@thirdweb-dev/wallets";
import {
  appleIconUri,
  googleIconUri,
} from "../../ConnectWallet/icons/socialLogins";

export const socialIcons: Record<EmbeddedWalletOauthStrategy, string> = {
  google: googleIconUri,
  apple: appleIconUri,
  // facebook: facebookIconUri,
};
