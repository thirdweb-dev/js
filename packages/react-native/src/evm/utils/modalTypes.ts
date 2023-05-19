import { WalletConfig } from "@thirdweb-dev/react-core";

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
  | "MainModal";

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
  data: {};
} & SheetModal;

// connect wallet flow
export type ConnectWalletFlowData = {
  modalTitle?: string;
  walletConfig?: WalletConfig;
};

export type ConnectWalletFlowModal = {
  view: "ConnectWalletFlow";
  data: ConnectWalletFlowData;
} & SheetModal;

// wallet details
export type WalletDetailsData = {
  address: string;
};

export type WalletDetailsModal = {
  view: "WalletDetails";
  data: WalletDetailsData;
} & SheetModal;

export type ModalState =
  | ClosedModal
  | ConnectWalletFlowModal
  | WalletDetailsModal;
