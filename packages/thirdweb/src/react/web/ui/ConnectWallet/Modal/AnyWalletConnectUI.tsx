import type { Wallet } from "../../../../../wallets/interfaces/wallet.js";
import { LoadingScreen } from "../../../wallets/shared/LoadingScreen.js";
import { useWalletInfo } from "../../hooks/useWalletInfo.js";

/**
 * @internal
 */
export function AnyWalletConnectUI(props: { wallet: Wallet }) {
  const walletInfo = useWalletInfo(props.wallet.id);

  if (walletInfo.isLoading) {
    return <LoadingScreen />;
  }

  // if wallet can connect to injected wallet + wallet is injected

  console.log(walletInfo.data);

  return <div>connect: {props.wallet.id}</div>;
}
