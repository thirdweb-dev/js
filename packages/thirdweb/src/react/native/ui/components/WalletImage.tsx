import { useQuery } from "@tanstack/react-query";
import type { ThirdwebClient } from "../../../../client/client.js";
import { resolveScheme } from "../../../../utils/ipfs.js";
import { nativeLocalStorage } from "../../../../utils/storage/nativeStorage.js";
import { getWalletInfo } from "../../../../wallets/__generated__/getWalletInfo.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import { getStoredActiveWalletId } from "../../../../wallets/manager/index.js";
import type { Theme } from "../../../core/design-system/index.js";
import { getLastAuthProvider } from "../../../core/utils/storage.js";
import {
  APPLE_ICON,
  DISCORD_ICON,
  EMAIL_ICON,
  FACEBOOK_ICON,
  FARCASTER_ICON,
  GITHUB_ICON,
  GOOGLE_ICON,
  GUEST_ICON,
  LINE_ICON,
  PASSKEY_ICON,
  PHONE_ICON,
  STEAM_ICON,
  TELEGRAM_ICON,
  TWITCH_ICON,
  WALLET_ICON,
  X_ICON,
} from "../icons/svgs.js";
import { RNImage } from "./RNImage.js";

export const WalletImage = (props: {
  theme: Theme;
  wallet: Wallet;
  client: ThirdwebClient;
  size: number;
  avatar?: string | null;
}) => {
  const { wallet, avatar, size, client } = props;

  const { data: imageData } = useQuery({
    enabled: !avatar,
    queryFn: async (): Promise<string> => {
      let activeEOAId = wallet.id;
      if (wallet.id === "smart") {
        // TODO (rn) investigate why the first render this returns null from storage
        const storedId = await getStoredActiveWalletId(nativeLocalStorage);
        if (storedId) {
          activeEOAId = storedId;
        } else {
          throw new Error("No active EOA wallet");
        }
      }
      let imageData: string;
      if (
        activeEOAId === "inApp" &&
        (wallet.id === "inApp" || wallet.id === "smart")
      ) {
        const lastAuthProvider = await getLastAuthProvider(nativeLocalStorage);
        imageData = getAuthProviderImage(lastAuthProvider);
        return imageData;
      }
      try {
        const externalWalletImage = await getWalletInfo(activeEOAId, true);
        if (externalWalletImage) {
          return externalWalletImage.startsWith("ipfs://")
            ? resolveScheme({ client, uri: externalWalletImage })
            : externalWalletImage;
        }
      } catch {}

      return WALLET_ICON;
    },
    queryKey: ["wallet-image", wallet.id, wallet.getAccount()?.address],
  });

  const data = avatar || imageData || WALLET_ICON;
  return (
    <RNImage
      color={props.theme.colors.accentButtonBg}
      data={data}
      size={size}
      theme={props.theme}
    />
  );
};

export function getAuthProviderImage(authProvider: string | null): string {
  switch (authProvider) {
    case "phone":
      return PHONE_ICON;
    case "email":
      return EMAIL_ICON;
    case "passkey":
      return PASSKEY_ICON;
    case "google":
      return GOOGLE_ICON;
    case "apple":
      return APPLE_ICON;
    case "facebook":
      return FACEBOOK_ICON;
    case "discord":
      return DISCORD_ICON;
    case "line":
      return LINE_ICON;
    case "x":
      return X_ICON;
    case "farcaster":
      return FARCASTER_ICON;
    case "telegram":
      return TELEGRAM_ICON;
    case "github":
      return GITHUB_ICON;
    case "twitch":
      return TWITCH_ICON;
    case "steam":
      return STEAM_ICON;
    case "guest":
      return GUEST_ICON;
    default:
      return WALLET_ICON;
  }
}
