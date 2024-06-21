import { useQuery } from "@tanstack/react-query";
import { nativeLocalStorage } from "../../../../utils/storage/nativeStorage.js";
import { getWalletInfo } from "../../../../wallets/__generated__/getWalletInfo.js";
import type { Account, Wallet } from "../../../../wallets/interfaces/wallet.js";
import {
  appleIconUri,
  emailIcon,
  facebookIconUri,
  genericWalletIcon,
  googleIconUri,
  phoneIcon,
} from "../../../core/utils/socialIcons.js";
import { getLastAuthProvider } from "../../../core/utils/storage.js";
import { RNImage } from "./RNImage.js";

export const WalletImage = (props: {
  wallet: Wallet;
  account: Account;
  size: number;
  ensAvatar?: string | null;
}) => {
  const { wallet, account, ensAvatar, size } = props;
  const { data: imageData } = useQuery({
    queryKey: ["wallet-image-or-ens", wallet.id, account.address],
    queryFn: async (): Promise<string> => {
      let imageData: string;
      if (ensAvatar) {
        return ensAvatar;
      }
      if (wallet.id === "inApp") {
        const lastAuthProvider = await getLastAuthProvider(nativeLocalStorage);
        switch (lastAuthProvider) {
          case "phone":
            imageData = phoneIcon;
            break;
          case "email":
            imageData = emailIcon;
            break;
          case "google":
            imageData = googleIconUri;
            break;
          case "apple":
            imageData = appleIconUri;
            break;
          case "facebook":
            imageData = facebookIconUri;
            break;
          default:
            imageData = genericWalletIcon;
            break;
        }
        return imageData;
      }
      try {
        const externalWalletImage = await getWalletInfo(wallet.id, true);
        if (externalWalletImage) {
          return externalWalletImage;
        }
      } catch {}

      return genericWalletIcon;
    },
  });

  return <RNImage data={imageData} size={size} />;
};
