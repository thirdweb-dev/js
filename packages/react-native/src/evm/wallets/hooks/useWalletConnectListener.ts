import { useWallet } from "@thirdweb-dev/react-core";
import { useCallback, useEffect } from "react";
import { useModalState } from "../../providers/ui-context-provider";
import { WCProposal, WCRequest } from "@thirdweb-dev/wallets";
import { isWalletConnectReceiverEnabled } from "../utils";

/**
 * Registers listeners for wallet connect if the active wallet
 * is a smart wallet and has connect to app enabled
 */
export function useWalletConnectListener() {
  const activeWallet = useWallet();
  const { setModalState } = useModalState();

  const onSmartWalletWCMessageListener = useCallback(
    ({ type, data }: { type: string; data?: unknown }) => {
      console.log("onSmartWalletWCMessage", type, data);
      switch (type) {
        case "session_proposal":
          setModalState({
            view: "WalletConnectSessionProposalModal",
            caller: "WCSessionProposalListener",
            data: data as WCProposal,
            isOpen: true,
            isSheet: false,
          });
          break;
        case "session_delete":
          //   reset();
          break;
        case "session_request":
          setModalState({
            view: "WalletConnectSessionRequestModal",
            caller: "WCSessionRequestListener",
            data: data as WCRequest,
            isOpen: true,
            isSheet: false,
          });
          break;
        default:
          console.log("useWalletConnectListener.typeNotHandled", type);
      }
    },
    [setModalState],
  );

  useEffect(() => {
    console.log("useWalletConnectListener");
    if (isWalletConnectReceiverEnabled(activeWallet)) {
      console.log("useWalletConnectListener.onSmartWalletWCMessage");
      activeWallet?.addListener("message", onSmartWalletWCMessageListener);
    }

    return () => {
      if (activeWallet) {
        console.log("useWalletConnectListener.removeListener");
        activeWallet.removeListener("message", onSmartWalletWCMessageListener);
      }
    };
  }, [activeWallet, onSmartWalletWCMessageListener]);
}
