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
              uri: getSocialIcon(lastAuthProvider),
              authProvider: lastAuthProvider as AuthOption,
            }
          : { uri: "", authProvider: "wallet" };
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
    return <EmailIcon size={props.size} color={theme.colors.accentText} />;
  }

  if (image?.authProvider === "phone") {
    return <PhoneIcon size={props.size} color={theme.colors.accentText} />;
  }

  if (image?.authProvider === "passkey") {
    return (
      <FingerPrintIcon size={props.size} color={theme.colors.accentText} />
    );
  }

  if (image?.authProvider === "wallet") {
    return (
      <OutlineWalletIcon size={props.size} color={theme.colors.accentText} />
    );
  }

  if (image?.authProvider === "guest") {
    return <GuestIcon size={props.size} color={theme.colors.accentText} />;
  }

  if (image?.uri) {
    return (
      <Img
        src={image.uri}
        width={props.size}
        height={props.size}
        loading="eager"
        client={props.client}
        style={{
          borderRadius: radius.md,
          ...props.style,
        }}
      />
    );
  }

  return (
    <WalletImageQuery id={props.id} size={props.size} client={props.client} />
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
        src={genericWalletIcon}
        width={props.size}
        height={props.size}
      />
    );
  }

  return <OutlineWalletIcon size={props.size} />;
}
