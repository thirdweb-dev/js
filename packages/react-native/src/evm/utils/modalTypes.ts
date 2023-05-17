import { WalletConfig } from "@thirdweb-dev/react-core";

export type ModalView =
  | "None"
  | "ConnectWalletFlow"
  | "ChooseWallet"
  | "WalletUI"
  | "WalletDetails"
  | "WCSessionRequest"
  | "WCSessionProposal";

export type EmptyModal = {
  view: "None";
  data: {};
  isOpen: boolean;
};

// connect wallet flow
export type ConnectWalletFlowData = {
  modalTitle?: string;
};

export type ConnectWalletFlowModal = {
  view: "ConnectWalletFlow";
  data: ConnectWalletFlowData;
  isOpen: boolean;
};

// choose wallet
export type ChooseWalletData = {
  modalTitle?: string;
};

export type ChooseWalletModal = {
  view: "ChooseWallet";
  data: ChooseWalletData;
  isOpen: boolean;
};

// wallet ui
export type WalletUIData = {
  connectModalTitle?: string;
  walletConfig: WalletConfig;
};

export type WalletUIModal = {
  view: "WalletUI";
  data: WalletUIData;
  isOpen: boolean;
};

export type ModalState =
  | EmptyModal
  | ConnectWalletFlowModal
  | ChooseWalletModal
  | WalletUIModal;
