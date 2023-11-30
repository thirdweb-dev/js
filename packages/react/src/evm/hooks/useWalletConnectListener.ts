import { useWallet, useWalletConnectHandler } from "@thirdweb-dev/react-core";
import { useCallback, useEffect } from "react";
import { WCProposal, WCRequest } from "@thirdweb-dev/wallets";

/**
 * Registers listeners for wallet connect if the active wallet
 * is also a WalletConnectReceiver
 */
export function useWalletConnectListener() {
  const activeWallet = useWallet();
  const walletConnectHandler = useWalletConnectHandler();

  const onSessionProposal = useCallback((proposal: WCProposal) => {
    console.log("onSessionProposal", proposal);
    // setModalState({
    //   view: "WalletConnectSessionProposalModal",
    //   caller: "WCSessionProposalListener",
    //   data: proposal,
    //   isOpen: true,
    //   isSheet: false,
    // });
  }, []);

  const onSessionRequest = useCallback((request: WCRequest) => {
    console.log("onSessionRequest", request);
    // setModalState({
    //   view: "WalletConnectSessionRequestModal",
    //   caller: "WCSessionRequestListener",
    //   data: request,
    //   isOpen: true,
    //   isSheet: false,
    // });
  }, []);

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
