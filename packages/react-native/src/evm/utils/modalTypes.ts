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

export type ModalView =
  | "Closed"
  | "ConnectWalletFlow"
  | "ChooseWallet"
  | "WalletUI"
  | "WalletDetails"
  | "WCSessionRequest"
  | "WCSessionProposal";

export type Caller =
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

export type SheetModal = {
  isOpen: boolean;
  isSheet: true;
  caller: Caller;
};

export type DialogModal = {
  isOpen: boolean;
  isSheet: false;
  caller: Caller;
};

export type ClosedModal = {
  view: "Closed";
  data: Record<string, never>;
} & SheetModal;

// connect wallet flow
export type ConnectEmbedData = {
  modalTitle?: string;
  modalTitleIconUrl?: string;
  termsOfServiceUrl?: string;
  privacyPolicyUrl?: string;
};

export type ConnectWalletFlowModal = {
  view: "ConnectWalletFlow";
  data: ConnectEmbedData;
} & SheetModal;

// wallet details
export type WalletDetailsData = {
  address: string;
};

export type WalletDetailsModal = {
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
