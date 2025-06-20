"use client";
import { useEffect, useState } from "react";
import type { ThirdwebClient } from "../../../../client/client.js";
import { webLocalStorage } from "../../../../utils/storage/webStorage.js";
import { getWalletInfo } from "../../../../wallets/__generated__/getWalletInfo.js";
import { getInstalledWalletProviders } from "../../../../wallets/injected/mipdStore.js";
import type { AuthOption } from "../../../../wallets/types.js";
import type { WalletId } from "../../../../wallets/wallet-types.js";
import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";
import { radius } from "../../../core/design-system/index.js";
import { useActiveWallet } from "../../../core/hooks/wallets/useActiveWallet.js";
import { getLastAuthProvider } from "../../../core/utils/storage.js";
import { useWalletImage } from "../../../core/utils/wallet.js";
import {
  genericWalletIcon,
  getSocialIcon,
} from "../../../core/utils/walletIcon.js";
import { EmailIcon } from "../ConnectWallet/icons/EmailIcon.js";
import { FingerPrintIcon } from "../ConnectWallet/icons/FingerPrintIcon.js";
import { GuestIcon } from "../ConnectWallet/icons/GuestIcon.js";
import { OutlineWalletIcon } from "../ConnectWallet/icons/OutlineWalletIcon.js";
import { PhoneIcon } from "../ConnectWallet/icons/PhoneIcon.js";
import { Img } from "./Img.js";

type WalletImageState = { uri: string; authProvider?: AuthOption };

/**
 * @internal
 */
export function WalletImage(props: {
  id: WalletId;
  size: string;
  client: ThirdwebClient;
  style?: React.CSSProperties;
}) {
  const theme = useCustomTheme();
  const [image, setImage] = useState<WalletImageState | undefined>(undefined);
  const activeWallet = useActiveWallet();
  useEffect(() => {
    async function fetchImage() {
      // show EOA icon for external wallets
      // show auth provider icon for in-app wallets
      // show the admin EOA icon for smart
      const storage = webLocalStorage;
      const activeEOAId = props.id;
      let image: WalletImageState | undefined;

      if (
        activeEOAId === "inApp" &&
        activeWallet &&
        (activeWallet.id === "inApp" || activeWallet.id === "smart")
      ) {
        // when showing an active wallet icon - check last auth provider and override the IAW icon
        const lastAuthProvider = await getLastAuthProvider(storage);
        image = lastAuthProvider
          ? {
              authProvider: lastAuthProvider as AuthOption,
              uri: getSocialIcon(lastAuthProvider),
            }
          : { authProvider: "wallet", uri: "" };
      } else {
        const mipdImage = getInstalledWalletProviders().find(
          (x) => x.info.rdns === activeEOAId,
        )?.info.icon;

        if (mipdImage) {
          image = { uri: mipdImage };
        } else {
          image = {
            uri: await getWalletInfo(activeEOAId, true),
          };
        }
      }

      setImage(image);
    }
    fetchImage();
  }, [props.id, activeWallet]);

  if (image?.authProvider === "email") {
    return <EmailIcon color={theme.colors.accentText} size={props.size} />;
  }

  if (image?.authProvider === "phone") {
    return <PhoneIcon color={theme.colors.accentText} size={props.size} />;
  }

  if (image?.authProvider === "passkey") {
    return (
      <FingerPrintIcon color={theme.colors.accentText} size={props.size} />
    );
  }

  if (image?.authProvider === "wallet") {
    return (
      <OutlineWalletIcon color={theme.colors.accentText} size={props.size} />
    );
  }

  if (image?.authProvider === "guest") {
    return <GuestIcon color={theme.colors.accentText} size={props.size} />;
  }

  if (image?.uri) {
    return (
      <Img
        client={props.client}
        height={props.size}
        loading="eager"
        src={image.uri}
        style={{
          borderRadius: radius.md,
          ...props.style,
        }}
        width={props.size}
      />
    );
  }

  return (
    <WalletImageQuery client={props.client} id={props.id} size={props.size} />
  );
}

function WalletImageQuery(props: {
  id: WalletId;
  size: string;
  client: ThirdwebClient;
}) {
  const walletImage = useWalletImage(props.id);

  if (walletImage.isFetched && !walletImage.data) {
    return (
      <Img
        client={props.client}
        height={props.size}
        src={genericWalletIcon}
        width={props.size}
      />
    );
  }

  return <OutlineWalletIcon size={props.size} />;
}
