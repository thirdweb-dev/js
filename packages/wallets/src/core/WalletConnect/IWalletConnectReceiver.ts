// wcv2
import { SignClientTypes } from "@walletconnect/types";
import { AbstractWallet } from "../../evm/wallets/abstract";

type JsonRpcError = {
  id: number;
  jsonrpc: string;
  error: { code: number; message: string; data?: string };
};

type JsonRpcResult = { id: number; jsonrpc: string; result: string };

export interface IWalletConnectReceiver {
  connectApp(uri: string): Promise<void>;
  approveSession(
    wallet: AbstractWallet,
    proposal: SignClientTypes.EventArguments["session_proposal"],
  ): Promise<void>;
  rejectSession(
    proposal: SignClientTypes.EventArguments["session_proposal"],
  ): Promise<void>;
  approveEIP155Request(
    wallet: AbstractWallet,
    requestEvent: SignClientTypes.EventArguments["session_request"],
  ): Promise<JsonRpcResult | JsonRpcError>;
  rejectEIP155Request(
    request: SignClientTypes.EventArguments["session_request"],
  ): Promise<JsonRpcError>;
}

export class NoOpWalletConnectReceiver implements IWalletConnectReceiver {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  connectApp(uri: string): Promise<void> {
    return Promise.resolve();
  }
  approveSession(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    wallet: AbstractWallet,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    proposal: SignClientTypes.EventArguments["session_proposal"],
  ): Promise<void> {
    return Promise.resolve();
  }
  rejectSession(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    proposal: SignClientTypes.EventArguments["session_proposal"],
  ): Promise<void> {
    return Promise.resolve();
  }
  approveEIP155Request(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    wallet: AbstractWallet,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    requestEvent: SignClientTypes.EventArguments["session_request"],
  ): Promise<JsonRpcError | JsonRpcResult> {
    return Promise.resolve({ id: 0, jsonrpc: "2.0", result: "" });
  }
  rejectEIP155Request(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    request: SignClientTypes.EventArguments["session_request"],
  ): Promise<JsonRpcError> {
    return Promise.resolve({
      id: 0,
      jsonrpc: "2.0",
      error: {
        code: 0,
        message: "",
      },
    });
  }
}
