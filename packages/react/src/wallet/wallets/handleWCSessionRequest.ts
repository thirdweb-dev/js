import { AbstractClientWallet } from "@thirdweb-dev/wallets";
import { isMobile, isAndroid, isIOS } from "../../evm/utils/isMobile";
import { openWindow } from "../utils/openWindow";

type URIs = {
  android: string;
  ios: string;
  other: string;
};

export function handelWCSessionRequest(
  wallet: AbstractClientWallet,
  uris: URIs,
) {
  if (isMobile()) {
    wallet.on("wc_session_request_sent", () => {
      if (isAndroid()) {
        openWindow(uris.android);
      } else if (isIOS()) {
        openWindow(uris.ios);
      } else {
        openWindow(uris.other);
      }
    });
  }
}
