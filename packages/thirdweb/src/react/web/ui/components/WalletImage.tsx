"use client";
import { useEffect, useState } from "react";
import type { ThirdwebClient } from "../../../../client/client.js";
import { getInstalledWalletProviders } from "../../../../wallets/injected/mipdStore.js";
import type { WalletId } from "../../../../wallets/wallet-types.js";
import { getLastAuthProvider } from "../../wallets/in-app/storage.js";
import { emailIcon, phoneIcon } from "../ConnectWallet/icons/dataUris.js";
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
  allowOverrides?: boolean;
}) {
  const [image, setImage] = useState<string | undefined>(undefined);
  useEffect(() => {
    async function fetchImage() {
      let mipdImage = getInstalledWalletProviders().find(
        (provider) => provider.info.rdns === props.id,
      )?.info.icon;

      if (props.allowOverrides && props.id === "inApp") {
        // check last auth provider and override the IAW icon
        const lastAuthProvider = await getLastAuthProvider();
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
        }
      }

      setImage(mipdImage);
    }
    fetchImage();
  }, [props.id, props.allowOverrides]);

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
      src={walletImage.data}
      width={props.size}
      height={props.size}
      loading="eager"
      style={{
        borderRadius: radius.md,
      }}
    />
  );
}
