// wcv2
import { SessionTypes, SignClientTypes } from "@walletconnect/types";
import { AbstractWallet } from "../../evm/wallets/abstract";

export type ErrorResponse = { code: number; message: string; data?: string };

export type JsonRpcError = {
  id: number;
  jsonrpc: string;
  error: ErrorResponse;
};

export type JsonRpcResult = { id: number; jsonrpc: string; result: string };

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
  ): Promise<void>;
  rejectEIP155Request(
    request: SignClientTypes.EventArguments["session_request"],
  ): Promise<void>;
  getActiveSessions(): Record<string, SessionTypes.Struct>;
  disconnectSession(params: {
    topic: string;
    reason: ErrorResponse;
  }): Promise<void>;
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
  ): Promise<void> {
    return Promise.resolve();
  }
  rejectEIP155Request(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    request: SignClientTypes.EventArguments["session_request"],
  ): Promise<void> {
    return Promise.resolve();
  }

  getActiveSessions(): Record<string, SessionTypes.Struct> {
    return {};
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  disconnectSession(params: {
    topic: string;
    reason: ErrorResponse;
  }): Promise<void> {
    return Promise.resolve();
  }
}
