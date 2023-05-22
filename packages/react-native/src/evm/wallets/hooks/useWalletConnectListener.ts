import { useWallet } from "@thirdweb-dev/react-core";
import { walletIds } from "@thirdweb-dev/wallets";
import { useCallback, useEffect } from "react";
import { useModalState } from "../../providers/ui-context-provider";
import {
  WalletConnectSessionProposalData,
  WalletConnectSessionRequestData,
} from "../../utils/modalTypes";

/**
 * Registers listeners for wallet connect if the active wallet
 * is a smart wallet and has connect to app enabled
 */
export function useWalletConnectListener() {
  const activeWallet = useWallet();
  const { setModalState } = useModalState();

  const onSmartWalletWCMessage = useCallback(
    ({ type, data }: { type: string; data?: unknown }) => {
      switch (type) {
        case "session_proposal":
          setModalState({
            view: "WalletConnectSessionProposalModal",
            caller: "WCSessionProposalListener",
            data: {
              proposalData: (data as WalletConnectSessionProposalData)
                .proposalData,
            },
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
            data: {
              requestData: (data as WalletConnectSessionRequestData)
                .requestData,
            },
            isOpen: true,
            isSheet: false,
          });
          break;
        default:
        // method not implemented
      }
    },
    [setModalState],
  );

  useEffect(() => {
    if (activeWallet?.walletId === walletIds.smartWallet) {
      activeWallet.addListener("message", onSmartWalletWCMessage);
    }

    return () => {
      if (activeWallet) {
        activeWallet.removeListener("message", onSmartWalletWCMessage);
      }
    };
  }, [activeWallet, onSmartWalletWCMessage]);
}
