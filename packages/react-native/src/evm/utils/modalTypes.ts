import { WalletConfig } from "@thirdweb-dev/react-core";
import { WCProposal, WCRequest } from "@thirdweb-dev/wallets";

export const CLOSE_MODAL_STATE = (caller: Caller): ModalState => {
  return {
    view: "Closed",
    data: {},
    isOpen: false,
    isSheet: true,
    caller: caller,
  };
};

type Caller =
  | "init"
  | "ConnectWallet"
  | "ConnectWalletDetails"
  | "ConnectWalletDetailsModal"
  | "ConnectWalletFlow"
  | "MainModal"
  | "SessionRequestModal"
  | "SessionProposalModal"
  | "WCSessionProposalListener"
  | "WCSessionRequestListener";

type SheetModal = {
  isOpen: boolean;
  isSheet: true;
  caller: Caller;
};

type DialogModal = {
  isOpen: boolean;
  isSheet: false;
  caller: Caller;
};

type ClosedModal = {
  view: "Closed";
  data: Record<string, never>;
} & SheetModal;

// connect wallet flow
type ConnectWalletFlowData = {
  modalTitle?: string;
  modalTitleIconUrl?: string;
  termsOfServiceUrl?: string;
  privacyPolicyUrl?: string;
  walletConfig?: WalletConfig;
};

export type ConnectWalletFlowModal = {
  view: "ConnectWalletFlow";
  data: ConnectWalletFlowData;
} & SheetModal;

// wallet details
type WalletDetailsData = {
  address: string;
};

type WalletDetailsModal = {
  view: "WalletDetails";
  data: WalletDetailsData;
} & SheetModal;

// wallet connect
export type WalletConnectSessionRequestModal = {
  view: "WalletConnectSessionRequestModal";
  data: WCRequest;
} & DialogModal;

export type WalletConnectSessionProposalModal = {
  view: "WalletConnectSessionProposalModal";
  data: WCProposal;
} & DialogModal;

export type ModalState =
  | ClosedModal
  | ConnectWalletFlowModal
  | WalletDetailsModal
  | WalletConnectSessionRequestModal
  | WalletConnectSessionProposalModal;
