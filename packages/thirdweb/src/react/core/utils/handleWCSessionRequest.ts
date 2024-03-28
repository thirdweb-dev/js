import { isAndroid, isIOS } from "./isMobile.js";
import { openWindow } from "./openWindow.js";

export type PlatformURIs = {
  android: string;
  ios: string;
  other: string;
};

/**
 *
 * @internal
 */
export function handelWCSessionRequest(uris: PlatformURIs) {
  if (isAndroid()) {
    openWindow(uris.android);
  } else if (isIOS()) {
    openWindow(uris.ios);
  } else {
    openWindow(uris.other);
  }
}
