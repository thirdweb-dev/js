import type { ConnectUIProps } from "../../types/wallets.js";
import { LocalWallet_Persist } from "./persist/LocalWallet_Persist.js";
import { LocalWallet_NoPersist } from "./LocalWallet_NoPersist.js";

/**
 * UI for connecting to a local wallet
 * @internal
 */
export const LocalWalletConnectUI = (props: {
  connectUIProps: ConnectUIProps;
  persist: boolean;
}) => {
  if (!props.persist) {
    return (
      <LocalWallet_NoPersist
        persist={props.persist}
        connectUIProps={props.connectUIProps}
      />
    );
  }

  return (
    <LocalWallet_Persist
      persist={props.persist}
      connectUIProps={props.connectUIProps}
    />
  );
};
