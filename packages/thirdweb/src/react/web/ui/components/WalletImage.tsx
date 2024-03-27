import { getMIPDStore } from "../../../../wallets/injected/mipdStore.js";
import type { WalletId } from "../../../../wallets/wallet-types.js";
import { radius } from "../design-system/index.js";
import { useWalletImage } from "../hooks/useWalletInfo.js";
import { Img } from "./Img.js";

/**
 * @internal
 */
export function WalletImage(props: { id: WalletId; size: string }) {
  const mipdImage = getMIPDStore()
    .getProviders()
    .find((provider) => provider.info.rdns === props.id)?.info.icon;

  if (mipdImage) {
    return (
      <Img
        src={mipdImage}
        width={props.size}
        height={props.size}
        loading="eager"
        style={{
          borderRadius: radius.md,
        }}
      />
    );
  }

  return <WalletImageQuery id={props.id} size={props.size} />;
}

function WalletImageQuery(props: { id: WalletId; size: string }) {
  const walletImage = useWalletImage(props.id);

  return (
    <Img
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
