import { useQuery } from "@tanstack/react-query";
import { nativeLocalStorage } from "../../../../utils/storage/nativeStorage.js";
import { getWalletInfo } from "../../../../wallets/__generated__/getWalletInfo.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import { getStoredActiveWalletId } from "../../../../wallets/manager/index.js";
import { getLastAuthProvider } from "../../../core/utils/storage.js";
import {
  APPLE_ICON,
  EMAIL_ICON,
  FACEBOOK_ICON,
  GOOGLE_ICON,
  PHONE_ICON,
  WALLET_ICON,
} from "../icons/svgs.js";
import { RNImage } from "./RNImage.js";

export const WalletImage = (props: {
  wallet: Wallet;
  size: number;
  ensAvatar?: string | null;
}) => {
  const { wallet, ensAvatar, size } = props;
  const { data: imageData } = useQuery({
    queryKey: [
      "wallet-image-or-ens",
      wallet.id,
      wallet.getAccount()?.address,
      ensAvatar,
    ],
    queryFn: async (): Promise<string> => {
      if (ensAvatar) {
        return ensAvatar;
      }
      const storage = nativeLocalStorage;
      let activeEOAId = wallet.id;
      if (wallet.id === "smart") {
        const storedId = await getStoredActiveWalletId(storage);
        if (storedId) {
          activeEOAId = storedId;
        }
      }
      let imageData: string;
      if (
        activeEOAId === "inApp" &&
        (wallet.id === "inApp" || wallet.id === "smart")
      ) {
        const lastAuthProvider = await getLastAuthProvider(nativeLocalStorage);
        switch (lastAuthProvider) {
          case "phone":
            imageData = PHONE_ICON;
            break;
          case "email":
            imageData = EMAIL_ICON;
            break;
          case "google":
            imageData = GOOGLE_ICON;
            break;
          case "apple":
            imageData = APPLE_ICON;
            break;
          case "facebook":
            imageData = FACEBOOK_ICON;
            break;
          default:
            imageData = WALLET_ICON;
            break;
        }
        return imageData;
      }
      try {
        const externalWalletImage = await getWalletInfo(activeEOAId, true);
        if (externalWalletImage) {
          return externalWalletImage;
        }
      } catch {}

      return WALLET_ICON;
    },
  });

  return <RNImage data={imageData} size={size} />;
};
