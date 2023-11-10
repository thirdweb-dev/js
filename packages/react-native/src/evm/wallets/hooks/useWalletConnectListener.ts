import { useWallet } from "@thirdweb-dev/react-core";
import { useCallback, useEffect } from "react";
import { useModalState } from "../../providers/ui-context-provider";
import {
  WCProposal,
  WCRequest,
  WalletConnectHandler,
} from "@thirdweb-dev/wallets";

/**
 * Registers listeners for wallet connect if the active wallet
 * is also a WalletConnectReceiver
 */
export function useWalletConnectListener(
  walletConnectHandler?: WalletConnectHandler,
) {
  const activeWallet = useWallet();
  const { setModalState } = useModalState();

  const onSessionProposal = useCallback(
    (proposal: WCProposal) => {
      setModalState({
        view: "WalletConnectSessionProposalModal",
        caller: "WCSessionProposalListener",
        data: proposal,
        isOpen: true,
        isSheet: false,
      });
    },
    [setModalState],
  );

  const onSessionRequest = useCallback(
    (proposal: WCRequest) => {
      setModalState({
        view: "WalletConnectSessionRequestModal",
        caller: "WCSessionRequestListener",
        data: proposal,
        isOpen: true,
        isSheet: false,
      });
    },
    [setModalState],
  );

  const onSessionDelete = useCallback(() => {
    // consider clearing local storage
  }, []);

  useEffect(() => {
    if (!walletConnectHandler) {
      return;
    }

    walletConnectHandler.addListener("session_proposal", onSessionProposal);
    walletConnectHandler.addListener("session_delete", onSessionDelete);
    walletConnectHandler.addListener("session_request", onSessionRequest);
    // consider adding switch_chain as well

    return () => {
      if (walletConnectHandler) {
        walletConnectHandler.removeListener(
          "session_proposal",
          onSessionProposal,
        );
        walletConnectHandler.removeListener("session_delete", onSessionDelete);
        walletConnectHandler.removeListener(
          "session_request",
          onSessionRequest,
        );
      }
    };
  }, [
    activeWallet,
    onSessionDelete,
    onSessionProposal,
    onSessionRequest,
    walletConnectHandler,
  ]);
}
