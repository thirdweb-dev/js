"use client";
import { useEffect, useState } from "react";
import type { ThirdwebClient } from "../../../../client/client.js";
import { getInstalledWalletProviders } from "../../../../wallets/injected/mipdStore.js";
import { getStoredActiveWalletId } from "../../../../wallets/manager/index.js";
import type { WalletId } from "../../../../wallets/wallet-types.js";
import { useActiveWallet } from "../../../core/hooks/wallets/wallet-hooks.js";
import { getStorage } from "../../../core/storage.js";
import { getLastAuthProvider } from "../../wallets/in-app/storage.js";
import {
  emailIcon,
  genericWalletIcon,
  passkeyIcon,
  phoneIcon,
} from "../ConnectWallet/icons/dataUris.js";
import {
  appleIconUri,
  facebookIconUri,
  googleIconUri,
} from "../ConnectWallet/icons/socialLogins.js";
import { radius } from "../design-system/index.js";
import { useWalletImage } from "../hooks/useWalletInfo.js";
import { Img } from "./Img.js";

// Note: Must not use useConnectUI here

/**
 * @internal
 */
export function WalletImage(props: {
  id: WalletId;
  size: string;
  client: ThirdwebClient;
}) {
  const [image, setImage] = useState<string | undefined>(undefined);
  const activeWallet = useActiveWallet();
  useEffect(() => {
    async function fetchImage() {
      // show EOA icon for external wallets
      // show auth provider icon for in-app wallets
      // show the admin EOA icon for smart
      const storage = getStorage();
      let activeEOAId = props.id;
      if (props.id === "smart") {
        const storedId = await getStoredActiveWalletId(storage);
        if (storedId) {
          activeEOAId = storedId;
        }
      }
      let mipdImage = getInstalledWalletProviders().find(
        (provider) => provider.info.rdns === activeEOAId,
      )?.info.icon;

      if (
        activeEOAId === "inApp" &&
        activeWallet &&
        (activeWallet.id === "inApp" || activeWallet.id === "smart")
      ) {
        // when showing an active wallet icon - check last auth provider and override the IAW icon
        const lastAuthProvider = await getLastAuthProvider(storage);
        switch (lastAuthProvider) {
          case "google":
            mipdImage = googleIconUri;
            break;
          case "apple":
            mipdImage = appleIconUri;
            break;
          case "facebook":
            mipdImage = facebookIconUri;
            break;
          case "phone":
            mipdImage = phoneIcon;
            break;
          case "email":
            mipdImage = emailIcon;
            break;
          case "passkey":
            mipdImage = passkeyIcon;
            break;
        }
      }

      setImage(mipdImage);
    }
    fetchImage();
  }, [props.id, activeWallet]);

  if (image) {
    return (
      <Img
        src={image}
        width={props.size}
        height={props.size}
        loading="eager"
        client={props.client}
        style={{
          borderRadius: radius.md,
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

  return (
    <Img
      client={props.client}
      src={walletImage.isLoading ? undefined : walletImage.data || ""}
      fallbackImage={genericWalletIcon}
      width={props.size}
      height={props.size}
      loading="eager"
      style={{
        borderRadius: radius.md,
      }}
    />
  );
}
